/* =========================================================
   FRIENDSHIP DAY — SCRIPT
   Loader, particles, cursor fx, nav, reveal, gallery, quotes,
   counters, wish generator, secret gift, music, celebration
   ========================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------------------------------------------------
     1. LOADER
  --------------------------------------------------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      startHeroHearts();
    }, 1200);
  });
  document.body.style.overflow = 'hidden';
  setTimeout(() => { document.body.style.overflow = ''; }, 2200); // safety fallback

  /* ---------------------------------------------------------
     2. PARTICLE BACKGROUND (floating dust + stars)
  --------------------------------------------------------- */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const PARTICLE_COUNT = isTouch ? 30 : 60;
  const colors = ['#4C6EF5', '#9B5DE5', '#F72585', '#FFC857'];

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.6,
      speedY: Math.random() * 0.35 + 0.08,
      speedX: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkle: Math.random() * Math.PI * 2,
    }));
  }
  initParticles();

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.twinkle += 0.02;
      const alpha = 0.35 + Math.sin(p.twinkle) * 0.25;
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    });
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(drawParticles);
  }
  if (!reduceMotion) requestAnimationFrame(drawParticles);
  else drawParticles();

  /* ---------------------------------------------------------
     3. CURSOR SPARKLE + HEART TRAIL (desktop only)
  --------------------------------------------------------- */
  if (!isTouch && !reduceMotion) {
    const dot = document.getElementById('cursor-dot');
    const heart = document.getElementById('cursor-heart');
    let mx = 0, my = 0, dx = 0, dy = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.opacity = 1; heart.style.opacity = 1;
      if (Math.random() < 0.05) spawnSparkle(e.clientX, e.clientY);
      if (Math.random() < 0.02) spawnCursorHeart(e.clientX, e.clientY);
    });
    function raf() {
      dx += (mx - dx) * 0.2; dy += (my - dy) * 0.2;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      heart.style.transform = `translate(${dx - 7}px, ${dy - 20}px)`;
      requestAnimationFrame(raf);
    }
    raf();

    function spawnSparkle(x, y) {
      const s = document.createElement('div');
      s.textContent = '✦';
      s.style.cssText = `position:fixed;left:${x}px;top:${y}px;color:#FFC857;font-size:${8 + Math.random() * 6}px;pointer-events:none;z-index:9997;transition:transform .8s ease-out, opacity .8s ease-out;`;
      document.body.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${-20 - Math.random() * 30}px) scale(0.3)`;
        s.style.opacity = '0';
      });
      setTimeout(() => s.remove(), 850);
    }
    function spawnCursorHeart(x, y) {
      const h = document.createElement('div');
      h.innerHTML = '<i class="fa-solid fa-heart"></i>';
      h.style.cssText = `position:fixed;left:${x}px;top:${y}px;color:#F72585;font-size:12px;pointer-events:none;z-index:9997;opacity:.8;transition:transform 1s ease-out, opacity 1s ease-out;`;
      document.body.appendChild(h);
      requestAnimationFrame(() => {
        h.style.transform = `translate(${(Math.random() - 0.5) * 30}px, -50px) scale(0.5)`;
        h.style.opacity = '0';
      });
      setTimeout(() => h.remove(), 1050);
    }
  } else {
    document.getElementById('cursor-dot').style.display = 'none';
    document.getElementById('cursor-heart').style.display = 'none';
  }

  /* ---------------------------------------------------------
     4. SCROLL PROGRESS BAR
  --------------------------------------------------------- */
  const progressBar = document.getElementById('scroll-progress-bar');
  const backToTop = document.getElementById('back-to-top');
  const navbar = document.getElementById('navbar');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    backToTop.hidden = scrollTop < 500;
    navbar.style.background = scrollTop > 20 ? 'var(--glass-bg-strong)' : 'transparent';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------------------------------------------------
     5. NAVBAR: burger + close on link click
  --------------------------------------------------------- */
  const burger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
    burger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  /* ---------------------------------------------------------
     6. DAY / NIGHT TOGGLE
  --------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  function applyTheme(day) {
    document.body.classList.toggle('day-mode', day);
    themeToggle.innerHTML = day ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
  const savedTheme = null; // in-memory only, no persistence across page loads by design
  applyTheme(false);
  themeToggle.addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('day-mode'));
    showToast('Theme switched');
  });

  /* ---------------------------------------------------------
     7. HERO: TYPING SUBTITLE
  --------------------------------------------------------- */
  const typingText = document.getElementById('typing-text');
  const fullText = 'Some friendships are not measured by time, but by memories, trust, and endless laughter.';
  let ti = 0;
  function typeLoop() {
    if (ti <= fullText.length) {
      typingText.textContent = fullText.slice(0, ti);
      ti++;
      setTimeout(typeLoop, 32);
    }
  }
  setTimeout(typeLoop, 1400);

  /* ---------------------------------------------------------
     8. HERO: FLOATING HEARTS
  --------------------------------------------------------- */
  const heroHearts = document.getElementById('hero-hearts');
  function startHeroHearts() {
    if (reduceMotion) return;
    setInterval(() => {
      const h = document.createElement('i');
      h.className = 'fa-solid fa-heart floating-heart';
      const size = 10 + Math.random() * 18;
      h.style.left = Math.random() * 100 + '%';
      h.style.fontSize = size + 'px';
      h.style.setProperty('--drift', (Math.random() - 0.5) * 120 + 'px');
      h.style.setProperty('--rot', Math.random() * 40 - 20 + 'deg');
      h.style.animationDuration = 6 + Math.random() * 5 + 's';
      heroHearts.appendChild(h);
      setTimeout(() => h.remove(), 11000);
    }, 900);
  }

  /* ---------------------------------------------------------
     9. BUTTON RIPPLE EFFECT
  --------------------------------------------------------- */
  document.querySelectorAll('.btn, .icon-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 1.6;
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.style.position = this.style.position || 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ---------------------------------------------------------
     10. SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------
     11. PHOTO GALLERY + LIGHTBOX
  --------------------------------------------------------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item[data-full]'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let currentIndex = 0;

  function openLightbox(i) {
    currentIndex = i;
    lightboxImg.src = galleryItems[i].dataset.full;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
  function showNext(dir) {
    currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].dataset.full;
  }
  galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => showNext(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => showNext(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext(1);
    if (e.key === 'ArrowLeft') showNext(-1);
  });

  /* ---------------------------------------------------------
     12. QUOTES ROTATOR
  --------------------------------------------------------- */
  const quotes = [
    'A real friend is one who walks in when the rest of the world walks out.',
    'Friendship is born at that moment when one person says to another, "What! You too?"',
    'True friends are never apart, maybe in distance but never in heart.',
    'The best mirror is an old friend.',
    'Friends are the family we choose for ourselves.',
    'A good friend knows all your stories; a best friend helped you write them.',
    'In the sweetness of friendship let there be laughter and sharing of pleasures.',
    'Friendship isn\'t about who you\'ve known the longest, it\'s about who came and never left.',
    'A sweet friendship refreshes the soul.',
    'Some people arrive and make such a beautiful impact, your life is never the same.',
    'Good friends are like stars — you don\'t always see them, but you know they\'re always there.',
    'A friend is someone who gives you total freedom to be yourself.',
  ];
  const quoteText = document.getElementById('quote-text');
  const quoteDots = document.getElementById('quote-dots');
  let quoteIndex = 0;

  quotes.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    quoteDots.appendChild(dot);
  });

  function setQuote(i) {
    quoteText.classList.add('fade');
    setTimeout(() => {
      quoteText.textContent = `"${quotes[i]}"`;
      quoteText.classList.remove('fade');
      [...quoteDots.children].forEach((d, di) => d.classList.toggle('active', di === i));
    }, 350);
  }
  setQuote(0);
  setInterval(() => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    setQuote(quoteIndex);
  }, 5000);

  /* ---------------------------------------------------------
     13. YEARS COUNTER + FRIENDSHIP METER (animate on view)
  --------------------------------------------------------- */
  const counterEl = document.getElementById('years-counter');
  const meterFill = document.getElementById('meter-fill');
  const meterLabel = document.getElementById('meter-label');
  const CIRC = 2 * Math.PI * 68; // r=68

  function animateCounter(el, target, duration = 1600) {
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateMeter(target = 100, duration = 1600) {
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const pct = eased * target;
      meterFill.style.strokeDashoffset = CIRC - (pct / 100) * CIRC;
      meterLabel.textContent = Math.round(pct) + '%';
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  meterFill.style.strokeDasharray = CIRC;
  meterFill.style.strokeDashoffset = CIRC;

  const statsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(counterEl, parseInt(counterEl.dataset.target, 10));
        animateMeter(100);
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(document.querySelector('.stats-section'));

  /* ---------------------------------------------------------
     14. WISH GENERATOR
  --------------------------------------------------------- */
  const wishes = [
    'May our friendship keep growing sweeter with every single year.',
    'Here\'s to more inside jokes only we will ever understand.',
    'Wishing you a life as bright and joyful as the laughter you bring to mine.',
    'May you always have a friend as lucky as I am to have you.',
    'Here\'s to many more adventures, big and small, side by side.',
    'May every hard day be softened by a message from a friend like you.',
    'Wishing you endless reasons to smile, and me right there causing half of them.',
    'May our bond stay unshakeable, no matter how far life takes us.',
    'Here\'s to growing older but never growing apart.',
    'Wishing you a heart as full as the one you\'ve given me.',
    'May you always find your way back home to the people who love you.',
    'Here\'s to friendship that needs no explanation, only appreciation.',
    'Wishing you laughter that never runs out and memories that never fade.',
    'May we always find our way back to each other, no matter the distance.',
    'Here\'s to being each other\'s constant in an ever-changing world.',
    'Wishing you a friendship this real in every chapter of your life.',
    'May today remind you how deeply, quietly grateful I am for you.',
    'Here\'s to the friend who turned ordinary days into favorite memories.',
    'Wishing you a year as loyal, kind, and joyful as you\'ve been to me.',
    'May our story keep writing itself, one good day at a time.',
    'Here\'s to the calls that last hours and somehow still feel too short.',
    'Wishing you a life surrounded by people who love you the way I do.',
    'May you never forget how much lighter you make everything feel.',
    'Here\'s to friendship — the family we somehow got to choose.',
    'Wishing you sunshine on the hard days, and me on the good ones.',
  ];
  const wishText = document.getElementById('wish-text');
  const wishBtn = document.getElementById('wish-btn');
  let lastWish = -1;
  wishBtn.addEventListener('click', () => {
    wishText.classList.add('fade');
    setTimeout(() => {
      let idx;
      do { idx = Math.floor(Math.random() * wishes.length); } while (idx === lastWish && wishes.length > 1);
      lastWish = idx;
      wishText.textContent = wishes[idx];
      wishText.classList.remove('fade');
    }, 300);
  });

  /* ---------------------------------------------------------
     15. SECRET GIFT BOX
  --------------------------------------------------------- */
  const giftBox = document.getElementById('gift-box');
  const giftMessage = document.getElementById('gift-message');
  const giftSparkles = document.getElementById('gift-sparkles');

  giftBox.addEventListener('click', () => {
    const opening = !giftBox.classList.contains('open');
    giftBox.classList.toggle('open');
    giftMessage.classList.toggle('show', opening);
    if (opening) {
      burstSparkles(giftSparkles, 16);
      showToast('A little something for you 💛');
    }
  });

  function burstSparkles(container, count) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('i');
      s.className = 'fa-solid fa-sparkle';
      const angle = (Math.PI * 2 * i) / count;
      const dist = 40 + Math.random() * 40;
      s.style.left = '50%';
      s.style.top = '50%';
      s.style.transition = 'transform .9s ease-out, opacity .9s ease-out';
      container.appendChild(s);
      requestAnimationFrame(() => {
        s.style.opacity = '1';
        s.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(1.4)`;
      });
      setTimeout(() => { s.style.opacity = '0'; }, 600);
      setTimeout(() => s.remove(), 950);
    }
  }

  /* ---------------------------------------------------------
     16. BACKGROUND MUSIC TOGGLE
  --------------------------------------------------------- */
  const music = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  musicToggle.addEventListener('click', () => {
    if (music.paused) {
      music.play().then(() => {
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-label', 'Pause background music');
      }).catch(() => {
        showToast('Add a "friendship.mp3" file next to index.html to enable music');
      });
    } else {
      music.pause();
      musicToggle.classList.remove('playing');
      musicToggle.setAttribute('aria-label', 'Play background music');
    }
  });

  /* ---------------------------------------------------------
     17. TOAST NOTIFICATIONS
  --------------------------------------------------------- */
  let toastTimer;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ---------------------------------------------------------
     18. CELEBRATION SYSTEM
     (confetti + fireworks + heart explosion + balloons + glow + shake)
  --------------------------------------------------------- */
  const cCanvas = document.getElementById('celebration-canvas');
  const cCtx = cCanvas.getContext('2d');
  let cW, cH;
  function resizeCCanvas() { cW = cCanvas.width = window.innerWidth; cH = cCanvas.height = window.innerHeight; }
  resizeCCanvas();
  window.addEventListener('resize', resizeCCanvas);

  let confettiParticles = [];
  let fireworkParticles = [];
  const confettiColors = ['#4C6EF5', '#9B5DE5', '#F72585', '#FFC857', '#ffffff'];

  function spawnConfetti(count = 140) {
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random() * cW,
        y: -20 - Math.random() * cH * 0.3,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedY: 2 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: 220 + Math.random() * 60,
      });
    }
  }

  function spawnFirework(x, y) {
    const count = 34;
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3.4;
      fireworkParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 0,
        maxLife: 50 + Math.random() * 20,
      });
    }
  }

  function celebrationLoop() {
    cCtx.clearRect(0, 0, cW, cH);

    confettiParticles.forEach((p) => {
      p.life++;
      p.x += p.speedX;
      p.y += p.speedY;
      p.rot += p.rotSpeed;
      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate((p.rot * Math.PI) / 180);
      cCtx.fillStyle = p.color;
      cCtx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cCtx.restore();
    });
    confettiParticles = confettiParticles.filter((p) => p.life < p.maxLife && p.y < cH + 40);

    fireworkParticles.forEach((p) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045;
      cCtx.beginPath();
      cCtx.fillStyle = p.color;
      cCtx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      cCtx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
      cCtx.fill();
    });
    fireworkParticles = fireworkParticles.filter((p) => p.life < p.maxLife);

    cCtx.globalAlpha = 1;

    if (confettiParticles.length || fireworkParticles.length) {
      requestAnimationFrame(celebrationLoop);
    } else {
      celebrationRunning = false;
    }
  }
  let celebrationRunning = false;
  function ensureLoopRunning() {
    if (!celebrationRunning) { celebrationRunning = true; requestAnimationFrame(celebrationLoop); }
  }

  const emojiLayer = document.getElementById('floating-emoji-layer');
  const celebrationEmojis = ['🎈', '❤️', '✨', '🎉', '💛', '💜'];
  function spawnFloatingEmojis(count = 22) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'floating-emoji';
      el.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
      el.style.left = Math.random() * 100 + '%';
      el.style.fontSize = 16 + Math.random() * 20 + 'px';
      el.style.setProperty('--drift', (Math.random() - 0.5) * 160 + 'px');
      el.style.setProperty('--rot', Math.random() * 60 - 30 + 'deg');
      el.style.animationDuration = 3.5 + Math.random() * 3 + 's';
      emojiLayer.appendChild(el);
      setTimeout(() => el.remove(), 7000);
    }
  }

  // simple celebratory chime using Web Audio API (no external file needed)
  function playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const actx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, actx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, actx.currentTime + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + i * 0.12 + 0.5);
        osc.connect(gain).connect(actx.destination);
        osc.start(actx.currentTime + i * 0.12);
        osc.stop(actx.currentTime + i * 0.12 + 0.55);
      });
    } catch (e) { /* audio not available — silently skip */ }
  }

  const celebrateBtn = document.getElementById('celebrate-btn');
  celebrateBtn.addEventListener('click', () => {
    spawnConfetti(160);
    for (let i = 0; i < 4; i++) {
      setTimeout(() => spawnFirework(
        cW * (0.2 + Math.random() * 0.6),
        cH * (0.2 + Math.random() * 0.35)
      ), i * 260);
    }
    ensureLoopRunning();
    if (!reduceMotion) spawnFloatingEmojis(26);
    if (!reduceMotion) {
      document.body.classList.add('shake-screen');
      setTimeout(() => document.body.classList.remove('shake-screen'), 500);
    }
    playChime();
    showToast('Happy Friendship Day! 🎉');
  });

  /* ---------------------------------------------------------
     19. GALLERY PLACEHOLDER CLICK HINT
  --------------------------------------------------------- */
  document.querySelectorAll('.gallery-placeholder').forEach((ph) => {
    ph.addEventListener('click', () => showToast('Swap this slot for your own photo in the HTML'));
  });

})();
