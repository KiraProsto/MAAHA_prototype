const track = document.querySelector('.ticker__track');
const text = track.textContent.trim();

// создаём клон текста, чтобы заполнить ширину
for (let i = 0; i < 20; i++) {
  const span = document.createElement('span');
  span.textContent = text;
  span.style.marginRight = '80px';
  track.appendChild(span);
}

let pos = 0;

function animate() {
  pos -= 1; // скорость
  track.style.transform = `translateX(${pos}px)`;

  if (Math.abs(pos) > track.scrollWidth / 2) {
    pos = 0;
  }

  requestAnimationFrame(animate);
}

animate();
