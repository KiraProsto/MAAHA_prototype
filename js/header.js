const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

const mobileSearchBtn = document.getElementById('mobileSearchBtn');
const mobileSearch = document.querySelector('.mobile-search');
const closeMobileSearch = document.querySelector('.mobile-search-close');

/* Бургер */
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav.classList.toggle('open');
});

/* Открыть поиск */
mobileSearchBtn.addEventListener('click', () => {
  mobileSearch.classList.add('open');
});

/* Закрыть поиск */
closeMobileSearch.addEventListener('click', () => {
  mobileSearch.classList.remove('open');
});
