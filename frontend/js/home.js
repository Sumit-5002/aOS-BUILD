// Animated counters for live stats
function animateCounter(id, end, duration = 2000) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const step = Math.ceil(end / (duration / 16));
  function update() {
    start += step;
    if (start >= end) {
      el.textContent = end.toLocaleString();
    } else {
      el.textContent = start.toLocaleString();
      requestAnimationFrame(update);
    }
  }
  update();
}
// Dark mode toggle and auto-detect
function setDarkMode(enabled) {
  document.documentElement.classList.toggle('dark-mode', enabled);
  localStorage.setItem('darkMode', enabled ? '1' : '0');
}
function detectSystemDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
// --- Animated Particle Background & Parallax ---
function createParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'bg-particles';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = 0;
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = 0.22;
  document.body.appendChild(canvas);
  let w = window.innerWidth, h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext('2d');
  let particles = [];
  const N = Math.max(32, Math.floor(w * h / 12000));
  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.5 + Math.random() * 2.5,
      dx: -0.2 + Math.random() * 0.4,
      dy: -0.2 + Math.random() * 0.4,
      glow: 0.5 + Math.random() * 1.5
    });
  }
  let mouse = {x: w/2, y: h/2};
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('resize', () => {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w; canvas.height = h;
  });
  function draw() {
    ctx.clearRect(0,0,w,h);
    for (let p of particles) {
      // Parallax: move slightly with mouse
      let px = p.x + (mouse.x-w/2)*0.03*p.glow;
      let py = p.y + (mouse.y-h/2)*0.03*p.glow;
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, 2*Math.PI);
      ctx.shadowColor = getComputedStyle(document.documentElement).getPropertyValue('--aqua-accent') || '#14B8A6';
      ctx.shadowBlur = 12 * p.glow;
      ctx.fillStyle = 'rgba(0,255,247,0.7)';
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.restore();
      // Move
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    }
    requestAnimationFrame(draw);
  }
  draw();
}
// Parallax for .futuristic-bg
function enableParallaxBg() {
  const bg = document.querySelector('.futuristic-bg');
  if (!bg) return;
  document.addEventListener('mousemove', e => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    bg.style.transform = `translate(${x*24}px,${y*24}px) scale(1.02)`;
  });
}
// Example usage:
document.addEventListener('DOMContentLoaded', () => {
  animateCounter('stat-pollutants', 128430);
  animateCounter('stat-pods', 42);
  animateCounter('stat-credits', 9871);
  // Dark mode init
  const saved = localStorage.getItem('darkMode');
  setDarkMode(saved === '1' || (saved === null && detectSystemDark()));
  // Toggle button
  let toggleBtn = document.getElementById('dark-toggle');
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.id = 'dark-toggle';
    toggleBtn.innerHTML = '🌙';
    toggleBtn.title = 'Toggle Dark Mode';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '1.2rem';
    toggleBtn.style.right = '1.2rem';
    toggleBtn.style.zIndex = 2000;
    toggleBtn.style.background = 'rgba(20,184,166,0.8)';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.border = 'none';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.width = '44px';
    toggleBtn.style.height = '44px';
    toggleBtn.style.fontSize = '1.5rem';
    toggleBtn.style.cursor = 'pointer';
    document.body.appendChild(toggleBtn);
  }
  toggleBtn.onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark ? '1' : '0');
  };
  // Mouse tracker
  let tracker = document.querySelector('.mouse-tracker');
  if (!tracker) {
    tracker = document.createElement('div');
    tracker.className = 'mouse-tracker';
    document.body.appendChild(tracker);
  }
  let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
  let trackerX = mouseX, trackerY = mouseY;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    tracker.style.opacity = '0.22';
  });
  function animateTracker() {
    trackerX += (mouseX - trackerX) * 0.18;
    trackerY += (mouseY - trackerY) * 0.18;
    tracker.style.transform = `translate(-50%, -50%) translate(${trackerX}px,${trackerY}px)`;
    requestAnimationFrame(animateTracker);
  }
  animateTracker();
  document.addEventListener('mouseleave', () => {
    tracker.style.opacity = '0';
  });
  createParticles();
  enableParallaxBg();
}); 