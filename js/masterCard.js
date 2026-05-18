import { masterClasses } from './masterClasses.js';

const container = document.getElementById('masterCards');

/* ---------------- РЕНДЕР КАРТОЧЕК ---------------- */

masterClasses.forEach((item) => {
  const card = document.createElement('div');
  card.className = 'master-card';

  card.innerHTML = `
    <img src="${item.mainImage}" alt="${item.title}">
    <div class="master-card__age">${item.age}</div>

    <div class="master-card__bottom">
      <div class="master-card__title">${item.title}</div>
      <div class="master-card__time">
        <img src="img/icons/time.svg" class="time-icon" alt="">
        <span>${item.duration}</span>
      </div>
    </div>
  `;

  card.addEventListener('click', () => openModal(item));

  container.appendChild(card);
});

/* ---------------- МОДАЛКА ---------------- */

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalAge = document.getElementById('modalAge');
const modalDuration = document.getElementById('modalDuration');
const modalPrice = document.getElementById('modalPrice');
const modalMainImage = document.getElementById('modalMainImage');
const modalDots = document.getElementById('modalDots');

let currentImages = [];
let currentIndex = 0;

/* Открытие модалки */
function openModal(item) {
  modal.style.display = 'flex';
  document.body.classList.add('modal-open'); // блокируем фон

  modalTitle.textContent = item.title;
  modalDesc.textContent = item.description || 'Описание появится позже';
  modalAge.textContent = item.age;
  modalDuration.textContent = item.duration;
  modalPrice.textContent = item.price || '—';

  currentImages = [
    { type: 'image', src: item.mainImage },
    ...(item.images || []).map((src) => ({
      type: src.endsWith('.mp4') ? 'video' : 'image',
      src,
    })),
  ];

  currentIndex = 0;

  updateGallery();
}

/* Обновление галереи */
function updateGallery() {
  const item = currentImages[currentIndex];

  const img = document.getElementById('modalMainImage');
  const video = document.getElementById('modalMainVideo');

  if (item.type === 'image') {
    img.style.display = 'block';
    video.style.display = 'none';
    img.src = item.src;
  } else {
    img.style.display = 'none';
    video.style.display = 'block';
    video.src = item.src;

    video.muted = true;
    video.play().catch(() => {});
  }

  modalDots.innerHTML = '';
  currentImages.forEach((_, i) => {
    const dot = document.createElement('div');
    if (i === currentIndex) dot.classList.add('active');
    dot.onclick = () => {
      currentIndex = i;
      updateGallery();
    };
    modalDots.appendChild(dot);
  });
}

/* Стрелки */
document.getElementById('modalPrev').onclick = () => {
  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateGallery();
};

document.getElementById('modalNext').onclick = () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateGallery();
};

/* Закрытие по крестику */
document.getElementById('modalClose').onclick = () => {
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
};

/* Закрытие по клику на фон */
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
});

/* ---------------- КНОПКА НАВЕРХ ---------------- */

const toTopBtn = document.getElementById('toTopBtn');
const masterSection = document.querySelector('.master');

window.addEventListener('scroll', () => {
  const masterTop = masterSection.offsetTop;

  if (window.scrollY >= masterTop - 100) {
    toTopBtn.classList.add('show');
    toTopBtn.classList.remove('hide');
  } else {
    toTopBtn.classList.add('hide');
    setTimeout(() => toTopBtn.classList.remove('show'), 300);
  }
});

toTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
