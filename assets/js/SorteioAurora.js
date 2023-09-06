// Variável global para armazenar os resultados do sorteio
let results = [];
// Variável para armazenar o arquivo Excel selecionado pelo usuário
let selectedFile = null;

// Evento acionado quando o botão "generate" é clicado
document.getElementById('fileInput').addEventListener('change', function () {
    selectedFile = document.getElementById('fileInput').files[0];
    const generateButton = document.getElementById('generate');

    // Verifica se há um arquivo selecionado
    generateButton.disabled = !selectedFile; // Habilita o botão se houver arquivo, desabilita caso contrário
});

// Evento acionado quando o botão "generate" é clicado
document.getElementById('generate').addEventListener('click', async function () {
    const min = 1;
    const max = parseInt(document.getElementById('max').value);

    if (isNaN(max) || max < min) {
        alert('Por favor insira um número válido de participantes para o sorteio.');
        return;
    }

    // Esconde o resultado anterior
    document.querySelector('#result>span').textContent = '';

    // Chama a função para gerar um número aleatório único dentro do intervalo [min, max]
    let result = generateUniqueNumber(min, max);

    // Verifica se o resultado do sorteio é válido
    if (result != null) {
        try {
            // Obtém o nome correspondente ao número sorteado do arquivo selecionado
            const name = await fetchNameFromNumber(result, selectedFile);

            // Adiciona o nome e o número sorteados à lista de resultados
            results.push({ name, number: result });

            // Limpa o campo de entrada
            document.getElementById('output').value = '';

            // Obtém o elemento com o id "output"
            const outputElement = document.getElementById('output');
            
            // Adiciona o nome e o número sorteados ao elemento "outputElement"
            outputElement.innerHTML = `<p>Nome: ${name}, Número: ${result}</p>`;
        } catch (error) {
            alert('Nome não encontrado no arquivo selecionado ou ocorreu um erro ao processar o arquivo.');
        }
    }

    // Verifica se a lista de resultados excedeu a quantidade de números únicos possíveis
    if (results.length >= (max - min + 1)) {
        alert('Todos os números únicos foram sorteados.');
        document.querySelector('#result>span').textContent = "Fim!";
        document.getElementById('generate').disabled = true; // Desabilita o botão de geração
        document.getElementById('downloadResults').disabled = false; // Habilita o botão de download de resultados
    }
});

// Função para gerar números aleatórios únicos
function generateUniqueNumber(min, max) {
    // Verifica se a lista de números sorteados já atingiu a quantidade máxima possível de números únicos
    if (results.length >= (max - min + 1)) {
        return null; // Retorna null quando todos os números únicos já foram gerados
    }

    // Gera um número aleatório dentro do intervalo [min, max]
    let result = Math.floor(Math.random() * (max - min + 1) + min);

    // Verifica se o número já foi sorteado anteriormente, e gera um novo número se for o caso
    while (results.some(entry => entry.number === result)) {
        result = Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Agora, ao gerar um número, também obtenha o nome correspondente do arquivo selecionado
    return result; // Retorna o número sorteado
}

// Função para buscar o nome correspondente ao número no arquivo Excel selecionado
async function fetchNameFromNumber(number, file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            // Encontrar o intervalo de células usado no arquivo
            const range = XLSX.utils.decode_range(worksheet['!ref']);

            // Iterar sobre as células para encontrar o nome correspondente ao número
            for (let row = range.s.r; row <= range.e.r; row++) {
                const cellNumber = worksheet[XLSX.utils.encode_cell({ r: row, c: 0 })]?.v;
                const cellName = worksheet[XLSX.utils.encode_cell({ r: row, c: 1 })]?.v;

                if (cellNumber === number) {
                    resolve(cellName);
                    return;
                }
            }

            reject("Nome não encontrado");
        };

        reader.onerror = function () {
            reject("Erro ao ler o arquivo.");
        }

        reader.readAsArrayBuffer(file);
    });
}

// Evento acionado quando o botão de download de resultados é clicado
document.getElementById('downloadResults').addEventListener('click', function () {
    // Chama a função para realizar o download do arquivo "resultado.txt" com todos os resultados
    downloadAllResults();
});

// Função para realizar o download do arquivo "resultado.txt" com todos os resultados
function downloadAllResults() {
    let txtContent = '';
    for (const result of results) {
        txtContent += `Nome: ${result.name}, Número: ${result.number}\n`;
    }

    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resultado.txt';
    a.click();
    URL.revokeObjectURL(url);
}