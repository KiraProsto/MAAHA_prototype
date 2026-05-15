import { holders } from './holders.js';
import { openProductModal, cart } from './productsRender.js';

const holdersGrid = document.getElementById('holdersGrid');

/* ---------------- РЕНДЕР КАРТОЧЕК ---------------- */

holders.forEach((product) => {
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

  holdersGrid.appendChild(card);
});

/* ---------------- КОРЗИНА ДЛЯ ПОДСВЕЧНИКОВ ---------------- */

holdersGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.product-card__btn');
  if (!btn) return;

  const id = String(btn.id.split('-')[1]); // ВАЖНО: id → строка

  /* --- ДОБАВЛЕНИЕ В КОРЗИНУ --- */
  if (!btn.classList.contains('counter')) {
    cart[id] = 1;
    localStorage.setItem('cart', JSON.stringify(cart));

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
    localStorage.setItem('cart', JSON.stringify(cart));

    btn.classList.remove('counter');
    btn.textContent = 'В корзину';
    return;
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  document.getElementById(`count-${id}`).textContent = cart[id];
});
