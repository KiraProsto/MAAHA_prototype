import { products } from './products.js';

const hitsContainer = document.getElementById('hits-list');

// берём первые 3 товара
const hits = products.slice(0, 3);

// создаём элементы один раз
hits.forEach((product, index) => {
  const item = document.createElement('div');
  item.className = 'hits__item';

  item.innerHTML = `
    <img src="${product.mainImage}" alt="${product.name}">
    <div class="hits__name">${product.name}</div>
  `;

  hitsContainer.appendChild(item);
});

// получаем элементы
const items = Array.from(document.querySelectorAll('.hits__item'));

// стартовые позиции
let positions = ['left', 'center', 'right'];

function applyPositions() {
  items.forEach((item, i) => {
    item.classList.remove('left', 'center', 'right');
    item.classList.add(positions[i]);
  });
}

applyPositions();

// каждые 3 секунды — плавный круговой сдвиг
setInterval(() => {
  positions.unshift(positions.pop()); // rotate right
  applyPositions();
}, 3000);
