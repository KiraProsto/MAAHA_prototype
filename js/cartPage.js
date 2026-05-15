import { products } from './products.js';
import { holders } from './holders.js';
import { sachets } from './sachets.js';

/* ---------------- ОБЪЕДИНЯЕМ ВСЕ ТОВАРЫ ---------------- */

const allProducts = [...products, ...holders, ...sachets];

/* ---------------- ЗАГРУЗКА КОРЗИНЫ ---------------- */

let cart = JSON.parse(localStorage.getItem('cart')) || {};

/* ---------------- СОХРАНЕНИЕ ---------------- */

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/* ---------------- ПОИСК ТОВАРА ПО ID ---------------- */

function getProductById(id) {
  return allProducts.find((p) => p.id === Number(id));
}

/* ---------------- ЭЛЕМЕНТЫ DOM ---------------- */

const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

/* ---------------- РЕНДЕР КОРЗИНЫ ---------------- */

function renderCart() {
  cartItems.innerHTML = '';

  const ids = Object.keys(cart);

  if (ids.length === 0) {
    cartItems.innerHTML = `<p class="empty">Корзина пуста</p>`;
    cartCount.textContent = '0 шт';
    cartTotal.textContent = '0 руб';
    return;
  }

  let totalPrice = 0;
  let totalCount = 0;

  ids.forEach((id) => {
    const product = getProductById(id);
    if (!product) return;

    const count = cart[id];
    const priceNum = Number(product.price.replace(/\D/g, ''));
    const itemTotal = priceNum * count;

    totalPrice += itemTotal;
    totalCount += count;

    const item = document.createElement('div');
    item.className = 'cart-item';

    item.innerHTML = `
      <img src="${product.mainImage}" class="cart-item__img">

      <div class="cart-item__center">
        <div class="cart-item__name">${product.name}</div>
        <div class="cart-item__price">${itemTotal} руб</div>
      </div>

      <div class="cart-item__counter">
        <div class="counter-btn" data-action="minus" data-id="${id}">−</div>
        <div class="counter-value">${count}</div>
        <div class="counter-btn" data-action="plus" data-id="${id}">+</div>
      </div>

      <button class="cart-item__buy" data-id="${id}">Купить</button>

      <div class="cart-item__delete" data-id="${id}">×</div>
    `;

    cartItems.appendChild(item);
  });

  cartCount.textContent = `${totalCount} шт`;
  cartTotal.textContent = `${totalPrice} руб`;
}

renderCart();

/* ---------------- ЛОГИКА КНОПОК В КОРЗИНЕ ---------------- */

cartItems.addEventListener('click', (e) => {
  const plusMinus = e.target.closest('.counter-btn');
  const del = e.target.closest('.cart-item__delete');
  const buyBtn = e.target.closest('.cart-item__buy');

  /* --- КУПИТЬ ОДИН ТОВАР --- */
  if (buyBtn) {
    const id = buyBtn.dataset.id;

    const singleOrder = { [id]: cart[id] };
    localStorage.setItem('checkoutOrder', JSON.stringify(singleOrder));

    window.location.href = 'checkout.html';
    return;
  }

  /* --- УДАЛЕНИЕ --- */
  if (del) {
    const id = del.dataset.id;
    delete cart[id];
    saveCart();
    renderCart();
    return;
  }

  /* --- ПЛЮС / МИНУС --- */
  if (plusMinus) {
    const id = plusMinus.dataset.id;
    const action = plusMinus.dataset.action;

    if (action === 'plus') cart[id]++;
    if (action === 'minus') cart[id]--;

    if (cart[id] <= 0) {
      delete cart[id];
    }

    saveCart();
    renderCart();
  }
});

/* ---------------- ОФОРМИТЬ ЗАКАЗ (ВСЯ КОРЗИНА) ---------------- */

document.querySelector('.cart__btn').addEventListener('click', () => {
  localStorage.setItem('checkoutOrder', JSON.stringify(cart));
  window.location.href = 'checkout.html';
});
