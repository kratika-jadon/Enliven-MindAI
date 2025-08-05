// File: script.js
const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
toggle.addEventListener('click', () => {
  navList.classList.toggle('show');
});