/* ============================================
   ZILA TOKEN — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initMouseGlow();
  initNavbar();
  initScrollAnimations();
  initAirdropModal();
  initPieChart();
});

/* === PARTICLE ANIMATION === */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0, 255, 136' : '0, 229, 255';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }
  animate();
}

/* === MOUSE GLOW === */
function initMouseGlow() {
  const glow = document.getElementById('mouse-glow');
  if (!glow) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function updateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(updateGlow);
  }
  updateGlow();
}

/* === NAVBAR === */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    // Close on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
      });
    });
  }
}

/* === SCROLL ANIMATIONS === */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate stat counters
        const counters = entry.target.querySelectorAll('.stat-number');
        counters.forEach(counter => {
          animateCounter(counter);
        });
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';

  const format = el.dataset.format;
  const duration = 2000;
  const start = performance.now();

  // Parse the target display value
  const displays = [
    { time: 0, text: '0' },
    { time: 0.2, text: format.includes('B') ? '0.3B' : format.includes('K') ? '10K+' : '20%' },
    { time: 0.4, text: format.includes('B') ? '0.6B' : format.includes('K') ? '20K+' : '40%' },
    { time: 0.6, text: format.includes('B') ? '0.9B' : format.includes('K') ? '30K+' : '60%' },
    { time: 0.8, text: format.includes('B') ? '1.2B' : format.includes('K') ? '40K+' : '80%' },
    { time: 1.0, text: format }
  ];

  let currentIndex = 0;

  function update() {
    const elapsed = performance.now() - start;
    const progress = Math.min(elapsed / duration, 1);

    while (currentIndex < displays.length - 1 && progress >= displays[currentIndex + 1].time) {
      currentIndex++;
    }

    el.textContent = displays[currentIndex].text;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = format;
    }
  }

  requestAnimationFrame(update);
}

/* === AIRDROP MODAL === */
function initAirdropModal() {
  const btn = document.getElementById('airdropBtn');
  const modal = document.getElementById('airdropModal');
  const closeBtn = document.getElementById('modalClose');
  const form = document.getElementById('airdropForm');
  const success = document.getElementById('formSuccess');

  if (!btn || !modal) return;

  btn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    success.classList.add('show');

    setTimeout(() => {
      closeModal();
      // Reset after close
      setTimeout(() => {
        form.style.display = '';
        success.classList.remove('show');
        form.reset();
      }, 500);
    }, 3000);
  });
}

/* === PIE CHART === */
function initPieChart() {
  const canvas = document.getElementById('pieChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  const size = 350;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const data = [
    { label: 'Staking Rewards', value: 40, color: '#00ff88' },
    { label: 'Ecosystem Dev', value: 20, color: '#00e5ff' },
    { label: 'Liquidity Pool', value: 15, color: '#7c3aed' },
    { label: 'Presale', value: 10, color: '#f59e0b' },
    { label: 'Team', value: 5, color: '#ef4444' },
    { label: 'Marketing', value: 5, color: '#ec4899' },
    { label: 'Airdrop', value: 5, color: '#06b6d4' }
  ];

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 30;
  const innerRadius = radius * 0.55;

  // Animate pie chart
  let progress = 0;
  const animDuration = 1500;
  const startTime = performance.now();

  function drawChart() {
    const elapsed = performance.now() - startTime;
    progress = Math.min(elapsed / animDuration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic

    ctx.clearRect(0, 0, size, size);

    let startAngle = -Math.PI / 2;
    const totalAngle = Math.PI * 2 * eased;

    data.forEach(segment => {
      const sliceAngle = (segment.value / 100) * totalAngle;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(cx + innerRadius * Math.cos(startAngle), cy + innerRadius * Math.sin(startAngle));
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = segment.color;
      ctx.fill();

      // Glow effect
      ctx.shadowColor = segment.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Gap between slices
      ctx.strokeStyle = '#0a0a0f';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Center text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${16}px Orbitron`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('1.5B', cx, cy - 10);
    ctx.font = `${11}px Inter`;
    ctx.fillStyle = '#b0b0b0';
    ctx.fillText('Total Supply', cx, cy + 14);

    if (progress < 1) {
      requestAnimationFrame(drawChart);
    }
  }

  // Start animation when visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      drawChart();
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(canvas);
}
