import { products } from './products.js';
import { holders } from './holders.js';
import { sachets } from './sachets.js';

const allProducts = [...products, ...holders, ...sachets];

// Берём именно checkoutOrder, а не cart
let cart = JSON.parse(localStorage.getItem('checkoutOrder')) || {};

function getProductById(id) {
  return allProducts.find((p) => p.id === Number(id));
}

const checkoutItems = document.getElementById('checkoutItems');
const sumProducts = document.getElementById('sumProducts');
const sumDelivery = document.getElementById('sumDelivery');
const sumFinal = document.getElementById('sumFinal');

function renderCheckout() {
  checkoutItems.innerHTML = '';

  let total = 0;

  Object.keys(cart).forEach((id) => {
    const product = getProductById(id);
    if (!product) return;

    const count = cart[id];
    const priceNum = Number(product.price.replace(/\D/g, ''));
    const itemTotal = priceNum * count;

    total += itemTotal;

    const div = document.createElement('div');
    div.className = 'checkout-item';

    div.innerHTML = `
      <img src="${product.mainImage}" class="checkout-item__img">
      <div class="checkout-item__info">
        <div class="checkout-item__name">${product.name}</div>
        <div class="checkout-item__count">Кол-во: ${count}</div>
        <div class="checkout-item__price">${itemTotal} руб</div>
      </div>
    `;

    checkoutItems.appendChild(div);
  });

  sumProducts.textContent = `${total} руб`;

  const delivery = 2000;
  sumDelivery.textContent = `${delivery} руб`;

  sumFinal.textContent = `${total + delivery} руб`;
}

renderCheckout();

document.getElementById('submitOrder').onclick = () => {
  alert('Заказ оформлен!');
};
