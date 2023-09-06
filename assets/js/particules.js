const particleContainer = document.querySelector(".particle-container");
const maxParticles = 5; // Defina o número máximo de partículas que deseja gerar

function createParticle() {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    const side = Math.floor(Math.random() * 4); // Gera um número aleatório de 0 a 3 para escolher o canto
    const x = Math.random();
    const y = Math.random();
    particle.style.setProperty('--x', x);
    particle.style.setProperty('--y', y);
    particle.style.animationDuration = `${4 + Math.random() * 6}s`; // Ajusta a duração da animação para variar de 4 a 10 segundos
    
    // Definir a posição da partícula de acordo com o canto escolhido
    switch (side) {
        case 0: // Canto superior esquerdo
            particle.style.top = 0;
            particle.style.left = 0;
            break;
        case 1: // Canto superior direito
            particle.style.top = 0;
            particle.style.right = 0;
            break;
    }
    
    particleContainer.appendChild(particle);

    // Remover a partícula após a animação ser concluída
    particle.addEventListener("animationend", () => {
        particleContainer.removeChild(particle);
    });
}

function generateParticles() {
    if (particleContainer.childElementCount < maxParticles) {
        createParticle();
    }
    setTimeout(generateParticles, 500); // Executa a função novamente a cada 500 milissegundos
}

generateParticles();
