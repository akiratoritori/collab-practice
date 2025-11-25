document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'color-splash';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const blobs = [];
  const blobCount = 22;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const burstLayer = document.createElement('div');
  burstLayer.id = 'burst-layer';
  document.body.appendChild(burstLayer);
  const burstPalette = ['#ff6ec4', '#ffd166', '#4ade80', '#60a5fa', '#f97316', '#f43f5e'];

  const resize = () => {
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    if (typeof ctx.resetTransform === 'function') {
      ctx.resetTransform();
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.scale(dpr, dpr);
  };

  const makeBlob = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: 120 + Math.random() * 140,
    hue: Math.random() * 360,
    speed: 0.2 + Math.random() * 0.6,
    wobble: Math.random() * Math.PI * 2,
  });

  const init = () => {
    blobs.length = 0;
    for (let i = 0; i < blobCount; i += 1) {
      blobs.push(makeBlob());
    }
  };

  const spawnConfetti = (x, y, count = 18) => {
    for (let i = 0; i < count; i += 1) {
      const chip = document.createElement('span');
      chip.className = 'confetti';
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 80;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 60;
      chip.style.setProperty('--dx', `${dx}px`);
      chip.style.setProperty('--dy', `${dy}px`);
      chip.style.setProperty('--top', `${y}px`);
      chip.style.setProperty('--left', `${x}px`);
      chip.style.setProperty('--color', burstPalette[i % burstPalette.length]);
      chip.style.width = `${8 + Math.random() * 6}px`;
      chip.style.height = `${12 + Math.random() * 10}px`;
      burstLayer.appendChild(chip);
      setTimeout(() => chip.remove(), 950);
    }
  };

const attachConfettiButton = () => {
  const trigger = document.querySelector('[data-confetti-btn]');
  if (!trigger) return;

  trigger.addEventListener('click', (event) => {
    event.stopPropagation(); // 二重発火を防ぐ
    const rect = trigger.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnConfetti(x, y, 26);
  });
};

attachConfettiButton();

  const draw = (t) => {
    const time = t * 0.001;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = 'lighter';

    blobs.forEach((blob, index) => {
      const x = (blob.x + Math.sin(time * blob.speed + blob.wobble) * 70 + window.innerWidth) % window.innerWidth;
      const y = (blob.y + Math.cos(time * (blob.speed * 0.8) + index) * 70 + window.innerHeight) % window.innerHeight;
      const radius = blob.radius * (1 + 0.08 * Math.sin(time * 0.6 + index));
      const hue = (blob.hue + time * 60) % 360;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `hsla(${hue}, 90%, 70%, 0.6)`);
      gradient.addColorStop(1, `hsla(${(hue + 60) % 360}, 90%, 60%, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };

  resize();
  init();
  requestAnimationFrame(draw);

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  const burstFromEvent = (event) => {
    spawnConfetti(event.clientX, event.clientY);
  };

  document.addEventListener('click', burstFromEvent);
  document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
      event.preventDefault();
      spawnConfetti(window.innerWidth / 2, window.innerHeight / 2);
    }
  });
});
