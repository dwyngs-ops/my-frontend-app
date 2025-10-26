<<<<<<< HEAD
/* ========== D'wyngs — script.js ========== */
/* Vanilla JS — interactive features, animations, lightbox, particles, custom cursor */

/* --------- Helpers ---------- */
const select = (s) => document.querySelector(s);
const selectAll = (s) => document.querySelectorAll(s);

/* ---------- Elements ---------- */
const hamburger = select('#hamburger');
const navLinks = select('#navLinks');
const navbar = select('#navbar');
const scrollTopBtn = select('#scrollTop');
const yearEl = select('#year');

/* Set current year */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Mobile hamburger ---------- */
hamburger && hamburger.addEventListener('click', () => {
  const opened = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', opened ? 'true' : 'false');
});

/* Close mobile nav on link click */
selectAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}));

/* ---------- Sticky navbar effect and scroll-top visibility ---------- */
window.addEventListener('scroll', () => {
  const sc = window.scrollY;
  if (sc > 40) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  if (scrollTopBtn) scrollTopBtn.style.opacity = sc > 400 ? 1 : 0;
});

/* ---------- Smooth internal scrolling ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------- Reveal on scroll (IntersectionObserver) ---------- */
const revealEls = document.querySelectorAll('.reveal, .service-card, .portfolio-item, .hero-title, .hero-sub');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ---------- Typewriter ---------- */
class TypeWriter {
  constructor(el, words, loop = true, wait = 2000) {
    this.el = el; this.words = words; this.loop = loop; this.wait = parseInt(wait, 10);
    this.txt = ''; this.wordIndex = 0; this.isDeleting = false; this.type();
  }
  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];
    if (this.isDeleting) this.txt = fullTxt.substring(0, this.txt.length - 1);
    else this.txt = fullTxt.substring(0, this.txt.length + 1);
    this.el.innerHTML = `<span>${this.txt}</span>`;
    let typeSpeed = 80;
    if (this.isDeleting) typeSpeed /= 2;
    if (!this.isDeleting && this.txt === fullTxt) { typeSpeed = this.wait; this.isDeleting = true; }
    else if (this.isDeleting && this.txt === '') { this.isDeleting = false; this.wordIndex++; typeSpeed = 400; }
    setTimeout(() => this.type(), typeSpeed);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const typeEl = document.querySelector('.typewrite');
  if (typeEl) {
    const words = JSON.parse(typeEl.getAttribute('data-words'));
    new TypeWriter(typeEl, words, true, 2000);
  }
});

/* ---------- Counters ---------- */
const counters = document.querySelectorAll('.count');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.getAttribute('data-target');
      let current = 0;
      const step = Math.max(1, Math.floor(target / 120));
      const counterTick = () => {
        current += step;
        if (current >= target) el.textContent = target;
        else { el.textContent = current; requestAnimationFrame(counterTick); }
      };
      counterTick();
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObserver.observe(c));

/* ---------- Testimonials slider ---------- */
const testimonials = selectAll('.testimonial');
let tIndex = 0;
const showTestimonial = (i) => {
  testimonials.forEach((t, idx) => t.classList.toggle('active', idx === i));
};
const nextTest = () => { tIndex = (tIndex + 1) % testimonials.length; showTestimonial(tIndex); };
const prevTest = () => { tIndex = (tIndex - 1 + testimonials.length) % testimonials.length; showTestimonial(tIndex); };
select('#nextTest')?.addEventListener('click', nextTest);
select('#prevTest')?.addEventListener('click', prevTest);
let testAutoplay = setInterval(nextTest, 6000);
select('#testimonialsWrap')?.addEventListener('mouseenter', () => clearInterval(testAutoplay));
select('#testimonialsWrap')?.addEventListener('mouseleave', () => testAutoplay = setInterval(nextTest, 6000));

/* ---------- Portfolio Lightbox ---------- */
const portfolioItems = Array.from(selectAll('.portfolio-item img'));
const lightbox = select('#lightbox');
const lightboxImage = select('#lightboxImage');
const lightboxTitle = select('#lightboxTitle');
const lightboxDesc = select('#lightboxDesc');
let currentIndex = 0;

portfolioItems.forEach((img, idx) => {
  img.closest('figure').addEventListener('click', () => {
    currentIndex = idx; openLightbox(img);
  });
});

function openLightbox(img) {
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt || '';
  lightboxTitle.textContent = img.dataset.title || '';
  lightboxDesc.textContent = img.dataset.desc || '';
  lightbox.setAttribute('aria-hidden', 'false');
}
function closeLightbox() { lightbox.setAttribute('aria-hidden', 'true'); }
select('#lightboxClose')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
select('#lightboxPrev')?.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
  openLightbox(portfolioItems[currentIndex]);
});
select('#lightboxNext')?.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % portfolioItems.length;
  openLightbox(portfolioItems[currentIndex]);
});
document.addEventListener('keydown', (e) => {
  if (lightbox.getAttribute('aria-hidden') === 'false') {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') select('#lightboxPrev').click();
    if (e.key === 'ArrowRight') select('#lightboxNext').click();
  }
});

/* ----------contact form to backend API---------- */
const contactForm = select('#contactForm');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = select('#name').value.trim();
  const email = select('#email').value.trim();
  const subject = select('#subject').value.trim() || 'Website inquiry';
  const message = select('#message').value.trim();

  if (!name || !email || !message) {
    alert('Please complete the required fields.');
    return;
  }

  try {
    const resp = await fetch('https://my-backend-app-vam9.onrender.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await resp.json();
    if (resp.ok && data.success) {
      alert('Message sent — thank you! We will get back to you shortly.');
      contactForm.reset();
    } else {
      alert(data.error || 'Failed to send message — please try again later.');
    }
  } catch (err) {
    console.error('Contact submit error', err);
    alert('Network error — could not send message.');
  }
});

/* ---------- Scroll to top ---------- */
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Custom cursor ---------- */
const cursor = select('#custom-cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
['a', 'button', '.portfolio-item', '.btn-gradient', '.btn-outline'].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.8)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
  });
});

/* ---------- Floating gold particles (canvas) ---------- */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas?.getContext && canvas.getContext('2d');
let particles = [];
function resizeCanvas(){
  if (!canvas) return;
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
}
function initParticles(){
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 90000);
  for (let i=0;i<count;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*2.8 + 0.6,
      vx: (Math.random()-0.5)/2,
      vy: (Math.random()*0.6)+0.2,
      alpha: Math.random()*0.8 + 0.08
    });
  }
}
function drawParticles(){
  if (!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,213,122,${p.alpha})`;
    ctx.shadowColor = 'rgba(255,213,122,0.9)';
    ctx.shadowBlur = 12;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    ctx.closePath();
    p.x += p.vx; p.y += p.vy;
    if (p.y > canvas.height + 10) p.y = -20;
    if (p.x > canvas.width + 30) p.x = -30;
    if (p.x < -30) p.x = canvas.width + 30;
  });
  requestAnimationFrame(drawParticles);
}
if (canvas && ctx){
  resizeCanvas(); initParticles(); drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
}

/* ---------- Tiny parallax on mouse for hero visual ---------- */
const heroVisual = select('.hero-visual');
document.addEventListener('mousemove', (e) => {
  if (!heroVisual) return;
  const rect = heroVisual.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  heroVisual.style.transform = `translate(${px*4}px, ${py*6}px)`;
  heroVisual.querySelector('img').style.transform = `translate(${px*10}px, ${py*8}px) scale(1.02)`;
  // glow subtle movement
  heroVisual.querySelectorAll('.glow-orb').forEach((orb, i) => {
    orb.style.transform = `translate(${px*(20 + i*6)}px, ${py*(10 + i*6)}px)`;
  });
});

/* ---------- Close dropdowns clicking outside ---------- */
document.addEventListener('click', (e) => {
  document.querySelectorAll('.dropdown').forEach(d => {
    if (!d.contains(e.target)) d.classList.remove('open');
  });
});

/* ---------- Accessibility: tab outlines for keyboard users ---------- */
document.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.body.classList.add('user-is-tabbing'); });
=======
/* ========== D'wyngs — script.js ========== */
/* Vanilla JS — interactive features, animations, lightbox, particles, custom cursor */

/* --------- Helpers ---------- */
const select = (s) => document.querySelector(s);
const selectAll = (s) => document.querySelectorAll(s);

/* ---------- Elements ---------- */
const hamburger = select('#hamburger');
const navLinks = select('#navLinks');
const navbar = select('#navbar');
const scrollTopBtn = select('#scrollTop');
const yearEl = select('#year');

/* Set current year */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Mobile hamburger ---------- */
hamburger && hamburger.addEventListener('click', () => {
  const opened = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', opened ? 'true' : 'false');
});

/* Close mobile nav on link click */
selectAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}));

/* ---------- Sticky navbar effect and scroll-top visibility ---------- */
window.addEventListener('scroll', () => {
  const sc = window.scrollY;
  if (sc > 40) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  if (scrollTopBtn) scrollTopBtn.style.opacity = sc > 400 ? 1 : 0;
});

/* ---------- Smooth internal scrolling ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------- Reveal on scroll (IntersectionObserver) ---------- */
const revealEls = document.querySelectorAll('.reveal, .service-card, .portfolio-item, .hero-title, .hero-sub');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ---------- Typewriter ---------- */
class TypeWriter {
  constructor(el, words, loop = true, wait = 2000) {
    this.el = el; this.words = words; this.loop = loop; this.wait = parseInt(wait, 10);
    this.txt = ''; this.wordIndex = 0; this.isDeleting = false; this.type();
  }
  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];
    if (this.isDeleting) this.txt = fullTxt.substring(0, this.txt.length - 1);
    else this.txt = fullTxt.substring(0, this.txt.length + 1);
    this.el.innerHTML = `<span>${this.txt}</span>`;
    let typeSpeed = 80;
    if (this.isDeleting) typeSpeed /= 2;
    if (!this.isDeleting && this.txt === fullTxt) { typeSpeed = this.wait; this.isDeleting = true; }
    else if (this.isDeleting && this.txt === '') { this.isDeleting = false; this.wordIndex++; typeSpeed = 400; }
    setTimeout(() => this.type(), typeSpeed);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const typeEl = document.querySelector('.typewrite');
  if (typeEl) {
    const words = JSON.parse(typeEl.getAttribute('data-words'));
    new TypeWriter(typeEl, words, true, 2000);
  }
});

/* ---------- Counters ---------- */
const counters = document.querySelectorAll('.count');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.getAttribute('data-target');
      let current = 0;
      const step = Math.max(1, Math.floor(target / 120));
      const counterTick = () => {
        current += step;
        if (current >= target) el.textContent = target;
        else { el.textContent = current; requestAnimationFrame(counterTick); }
      };
      counterTick();
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObserver.observe(c));

/* ---------- Testimonials slider ---------- */
const testimonials = selectAll('.testimonial');
let tIndex = 0;
const showTestimonial = (i) => {
  testimonials.forEach((t, idx) => t.classList.toggle('active', idx === i));
};
const nextTest = () => { tIndex = (tIndex + 1) % testimonials.length; showTestimonial(tIndex); };
const prevTest = () => { tIndex = (tIndex - 1 + testimonials.length) % testimonials.length; showTestimonial(tIndex); };
select('#nextTest')?.addEventListener('click', nextTest);
select('#prevTest')?.addEventListener('click', prevTest);
let testAutoplay = setInterval(nextTest, 6000);
select('#testimonialsWrap')?.addEventListener('mouseenter', () => clearInterval(testAutoplay));
select('#testimonialsWrap')?.addEventListener('mouseleave', () => testAutoplay = setInterval(nextTest, 6000));

/* ---------- Portfolio Lightbox ---------- */
const portfolioItems = Array.from(selectAll('.portfolio-item img'));
const lightbox = select('#lightbox');
const lightboxImage = select('#lightboxImage');
const lightboxTitle = select('#lightboxTitle');
const lightboxDesc = select('#lightboxDesc');
let currentIndex = 0;

portfolioItems.forEach((img, idx) => {
  img.closest('figure').addEventListener('click', () => {
    currentIndex = idx; openLightbox(img);
  });
});

function openLightbox(img) {
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt || '';
  lightboxTitle.textContent = img.dataset.title || '';
  lightboxDesc.textContent = img.dataset.desc || '';
  lightbox.setAttribute('aria-hidden', 'false');
}
function closeLightbox() { lightbox.setAttribute('aria-hidden', 'true'); }
select('#lightboxClose')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
select('#lightboxPrev')?.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
  openLightbox(portfolioItems[currentIndex]);
});
select('#lightboxNext')?.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % portfolioItems.length;
  openLightbox(portfolioItems[currentIndex]);
});
document.addEventListener('keydown', (e) => {
  if (lightbox.getAttribute('aria-hidden') === 'false') {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') select('#lightboxPrev').click();
    if (e.key === 'ArrowRight') select('#lightboxNext').click();
  }
});

/* ----------contact form to backend API---------- */
const contactForm = select('#contactForm');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = select('#name').value.trim();
  const email = select('#email').value.trim();
  const subject = select('#subject').value.trim() || 'Website inquiry';
  const message = select('#message').value.trim();

  if (!name || !email || !message) {
    alert('Please complete the required fields.');
    return;
  }

  try {
    const resp = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await resp.json();
    if (resp.ok && data.success) {
      alert('Message sent — thank you! We will get back to you shortly.');
      contactForm.reset();
    } else {
      alert(data.error || 'Failed to send message — please try again later.');
    }
  } catch (err) {
    console.error('Contact submit error', err);
    alert('Network error — could not send message.');
  }
});

/* ---------- Scroll to top ---------- */
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Custom cursor ---------- */
const cursor = select('#custom-cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
['a', 'button', '.portfolio-item', '.btn-gradient', '.btn-outline'].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.8)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
  });
});

/* ---------- Floating gold particles (canvas) ---------- */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas?.getContext && canvas.getContext('2d');
let particles = [];
function resizeCanvas(){
  if (!canvas) return;
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
}
function initParticles(){
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 90000);
  for (let i=0;i<count;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*2.8 + 0.6,
      vx: (Math.random()-0.5)/2,
      vy: (Math.random()*0.6)+0.2,
      alpha: Math.random()*0.8 + 0.08
    });
  }
}
function drawParticles(){
  if (!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,213,122,${p.alpha})`;
    ctx.shadowColor = 'rgba(255,213,122,0.9)';
    ctx.shadowBlur = 12;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    ctx.closePath();
    p.x += p.vx; p.y += p.vy;
    if (p.y > canvas.height + 10) p.y = -20;
    if (p.x > canvas.width + 30) p.x = -30;
    if (p.x < -30) p.x = canvas.width + 30;
  });
  requestAnimationFrame(drawParticles);
}
if (canvas && ctx){
  resizeCanvas(); initParticles(); drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
}

/* ---------- Tiny parallax on mouse for hero visual ---------- */
const heroVisual = select('.hero-visual');
document.addEventListener('mousemove', (e) => {
  if (!heroVisual) return;
  const rect = heroVisual.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  heroVisual.style.transform = `translate(${px*4}px, ${py*6}px)`;
  heroVisual.querySelector('img').style.transform = `translate(${px*10}px, ${py*8}px) scale(1.02)`;
  // glow subtle movement
  heroVisual.querySelectorAll('.glow-orb').forEach((orb, i) => {
    orb.style.transform = `translate(${px*(20 + i*6)}px, ${py*(10 + i*6)}px)`;
  });
});

/* ---------- Close dropdowns clicking outside ---------- */
document.addEventListener('click', (e) => {
  document.querySelectorAll('.dropdown').forEach(d => {
    if (!d.contains(e.target)) d.classList.remove('open');
  });
});

/* ---------- Accessibility: tab outlines for keyboard users ---------- */
document.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.body.classList.add('user-is-tabbing'); });
>>>>>>> 6a1edfd756e21304f5ffc60a6aed9ba385e2112f
