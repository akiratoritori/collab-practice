document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'color-splash';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const blobs = [];
  const blobCount = 22;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

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
});
