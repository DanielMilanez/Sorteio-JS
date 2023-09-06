const menuIcon = document.querySelector('.menu-icon');
const dropdown = document.getElementById('dropdown');

menuIcon.addEventListener('click', function() {
    dropdown.classList.toggle('show');
});

const fileInput = document.getElementById('fileInput');
const fileStatus = document.querySelector('.file-status');

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    fileStatus.classList.add('hide');
  } else {
    fileStatus.classList.remove('hide');
  }
});