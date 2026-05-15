import { products } from './products.js';

const grid = document.getElementById('interiorGrid');

/* ---------------- КОРЗИНА ---------------- */
export const cart = JSON.parse(localStorage.getItem('cart')) || {};

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/* ---------------- РЕНДЕР КАРТОЧЕК ---------------- */

export function renderProducts() {
  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.mainImage}" alt="${product.name}">
      <div class="product-card__name">${product.name}</div>
      <div class="product-card__price">${product.price}</div>
      <div class="product-card__btn" id="btn-${product.id}">В корзину</div>
    `;

    /* Открытие модалки */
    card.addEventListener('click', (e) => {
      if (
        !e.target.classList.contains('product-card__btn') &&
        !e.target.classList.contains('counter-btn')
      ) {
        openProductModal(product);
      }
    });

    grid.appendChild(card);
  });
}

renderProducts();
syncCatalogWithCart();

/* ---------------- КОРЗИНА В КАРТОЧКЕ ---------------- */

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('.product-card__btn');
  if (!btn) return;

  const id = String(btn.id.split('-')[1]);

  /* --- ДОБАВЛЕНИЕ В КОРЗИНУ --- */
  if (!btn.classList.contains('counter')) {
    cart[id] = 1;
    saveCart();
    syncCatalogWithCart();

    btn.classList.add('counter');
    btn.innerHTML = `
      <div class="counter-btn" data-action="minus">−</div>
      <div class="counter-value" id="count-${id}">1</div>
      <div class="counter-btn" data-action="plus">+</div>
    `;
    return;
  }

  /* --- ПЛЮС / МИНУС --- */
  const actionBtn = e.target.closest('.counter-btn');
  if (!actionBtn) return;

  const action = actionBtn.dataset.action;

  if (action === 'plus') cart[id]++;
  if (action === 'minus') cart[id]--;

  if (cart[id] <= 0) {
    delete cart[id];
    saveCart();
    syncCatalogWithCart();

    btn.classList.remove('counter');
    btn.textContent = 'В корзину';
    return;
  }

  saveCart();
  syncCatalogWithCart();
  document.getElementById(`count-${id}`).textContent = cart[id];
});

/* ---------------- МОДАЛКА ---------------- */

const productModal = document.getElementById('productModal');
const productModalTitle = document.getElementById('productModalTitle');
const productModalDesc = document.getElementById('productModalDesc');
const productModalAdvantages = document.getElementById(
  'productModalAdvantages',
);
const productModalCharacteristics = document.getElementById(
  'productModalCharacteristics',
);
const productModalMainImage = document.getElementById('productModalMainImage');
const productModalDots = document.getElementById('productModalDots');
const productModalBtn = document.getElementById('productModalBtn');

let modalImages = [];
let modalIndex = 0;
let modalProductId = null;

/* ---------------- ОТКРЫТИЕ МОДАЛКИ ---------------- */

export function openProductModal(product) {
  productModal.style.display = 'flex';
  document.body.classList.add('modal-open');

  modalProductId = String(product.id);

  productModalTitle.textContent = product.name;
  productModalDesc.textContent = product.description || '';
  productModalAdvantages.textContent = product.advantages || '';
  productModalCharacteristics.textContent = product.characteristics || '';

  modalImages = [product.mainImage, ...product.gallery];
  modalIndex = 0;

  updateProductGallery();

  /* --- СОСТОЯНИЕ КНОПКИ --- */
  if (cart[modalProductId]) {
    productModalBtn.classList.add('counter');
    productModalBtn.innerHTML = `
      <div class="counter-btn" data-action="minus">−</div>
      <div class="counter-value">${cart[modalProductId]}</div>
      <div class="counter-btn" data-action="plus">+</div>
    `;
  } else {
    productModalBtn.classList.remove('counter');
    productModalBtn.textContent = 'В корзину';
  }
}

/* ---------------- ГАЛЕРЕЯ ---------------- */

function updateProductGallery() {
  productModalMainImage.src = modalImages[modalIndex];

  productModalDots.innerHTML = '';
  modalImages.forEach((_, i) => {
    const dot = document.createElement('div');
    if (i === modalIndex) dot.classList.add('active');
    dot.onclick = () => {
      modalIndex = i;
      updateProductGallery();
    };
    productModalDots.appendChild(dot);
  });
}

document.getElementById('productModalPrev').onclick = () => {
  modalIndex = (modalIndex - 1 + modalImages.length) % modalImages.length;
  updateProductGallery();
};

document.getElementById('productModalNext').onclick = () => {
  modalIndex = (modalIndex + 1) % modalImages.length;
  updateProductGallery();
};

/* ---------------- КНОПКА / СЧЁТЧИК В МОДАЛКЕ ---------------- */

productModalBtn.addEventListener('click', (e) => {
  const btn = e.target.closest('.product-modal__btn');
  if (!btn) return;

  /* --- ДОБАВЛЕНИЕ --- */
  if (!btn.classList.contains('counter')) {
    cart[modalProductId] = 1;
    saveCart();
    syncCatalogWithCart();

    btn.classList.add('counter');
    btn.innerHTML = `
      <div class="counter-btn" data-action="minus">−</div>
      <div class="counter-value">${cart[modalProductId]}</div>
      <div class="counter-btn" data-action="plus">+</div>
    `;
    return;
  }

  /* --- ПЛЮС / МИНУС --- */
  const actionBtn = e.target.closest('.counter-btn');
  if (!actionBtn) return;

  const action = actionBtn.dataset.action;

  if (action === 'plus') cart[modalProductId]++;
  if (action === 'minus') cart[modalProductId]--;

  if (cart[modalProductId] <= 0) {
    delete cart[modalProductId];
    saveCart();
    syncCatalogWithCart();

    btn.classList.remove('counter');
    btn.textContent = 'В корзину';
    return;
  }

  saveCart();
  syncCatalogWithCart();
  btn.querySelector('.counter-value').textContent = cart[modalProductId];
});

/* ---------------- ЗАКРЫТИЕ МОДАЛКИ ---------------- */

document.getElementById('productModalClose').onclick = () => {
  productModal.style.display = 'none';
  document.body.classList.remove('modal-open');
};

productModal.addEventListener('click', (e) => {
  if (e.target === productModal) {
    productModal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
});

function syncCatalogWithCart() {
  Object.keys(cart).forEach((id) => {
    const btn = document.getElementById(`btn-${id}`);
    if (!btn) return;

    btn.classList.add('counter');
    btn.innerHTML = `
      <div class="counter-btn" data-action="minus">−</div>
      <div class="counter-value" id="count-${id}">${cart[id]}</div>
      <div class="counter-btn" data-action="plus">+</div>
    `;
  });
}
