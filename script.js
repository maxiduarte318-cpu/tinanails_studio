/* ==============================
   TINA NAILS STUDIO — script.js
   ============================== */

// ─── NAVBAR scroll ───────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── BURGER menú móvil ────────────────────────────────────────────
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  burger.setAttribute('aria-expanded', isOpen);
  const spans = burger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ─── STATS contador animado ───────────────────────────────────────
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, step);
}

const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNums.forEach(animateCount);
    }
  });
}, { threshold: 0.4 });

const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

// ─── SCROLL REVEAL ────────────────────────────────────────────────
const reveals = document.querySelectorAll(
  '.servicio-card, .galeria-item, .testimonio-card, .stat-item, .info-item, .sobre-text p, .sobre-lista li'
);
reveals.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

// ─── SLIDER de testimonios ───────────────────────────────────────
const track = document.getElementById('track');
const dotsContainer = document.getElementById('dots');

if (track) {
  const cards = track.querySelectorAll('.testimonio-card');
  let currentSlide = 0;
  let cardsPerView = getCardsPerView();

  function getCardsPerView() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const n = Math.ceil(cards.length / getCardsPerView());
    for (let i = 0; i < n; i++) {
      const btn = document.createElement('button');
      btn.classList.add('dot');
      if (i === currentSlide) btn.classList.add('active');
      btn.setAttribute('aria-label', `Testimonio ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(btn);
    }
  }

  function goTo(index) {
    const cpv = getCardsPerView();
    const maxSlide = Math.ceil(cards.length / cpv) - 1;
    currentSlide = Math.max(0, Math.min(index, maxSlide));
    const cardWidth = track.parentElement.offsetWidth / cpv;
    track.style.transform = `translateX(-${currentSlide * cardWidth * cpv}px)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  buildDots();

  let autoSlide = setInterval(() => {
    const nextSlide = (currentSlide + 1) % Math.ceil(cards.length / getCardsPerView());
    goTo(nextSlide);
  }, 4500);

  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      goTo((currentSlide + 1) % Math.ceil(cards.length / getCardsPerView()));
    }, 4500);
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  });

  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    buildDots();
    goTo(0);
  });
}

// ─── Fijar fecha mínima en el input date ─────────────────────────
const inputFecha = document.getElementById('fecha');
if (inputFecha) {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  inputFecha.min = `${yyyy}-${mm}-${dd}`;
}

// ─── FORMULARIO de reserva ────────────────────────────────────────
const btnEnviar = document.getElementById('btnEnviar');
const toast     = document.getElementById('toast');

function showToast(msg, color = '#2C2C2C') {
  toast.textContent = msg;
  toast.style.background = color;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3600);
}

function validateForm() {
  const nombre   = document.getElementById('nombre').value.trim();
  const tel      = document.getElementById('tel').value.trim();
  const servicio = document.getElementById('servicio').value;
  const fecha    = document.getElementById('fecha').value;

  if (!nombre)  { showToast('👤 Por favor ingresá tu nombre.', '#C2577A'); return false; }
  if (!tel)     { showToast('📱 Ingresá tu número de WhatsApp.', '#C2577A'); return false; }
  if (!servicio){ showToast('💅 Elegí un servicio.', '#C2577A'); return false; }
  if (!fecha)   { showToast('📅 Seleccioná una fecha preferida.', '#C2577A'); return false; }

  const selected = new Date(fecha);
  const today    = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) {
    showToast('📅 La fecha no puede ser en el pasado.', '#C2577A');
    return false;
  }

  return true;
}

if (btnEnviar) {
  btnEnviar.addEventListener('click', () => {
    if (!validateForm()) return;

    const nombre   = document.getElementById('nombre').value.trim();
    const tel      = document.getElementById('tel').value.trim();
    const servicio = document.getElementById('servicio').value;
    const fecha    = document.getElementById('fecha').value;
    const mensaje  = document.getElementById('mensaje').value.trim();

    const texto = `Hola! Quiero reservar un turno 💅%0A%0A` +
      `*Nombre:* ${nombre}%0A` +
      `*WhatsApp:* ${tel}%0A` +
      `*Servicio:* ${servicio}%0A` +
      `*Fecha:* ${fecha}%0A` +
      `*Diseño:* ${mensaje || 'Sin especificar'}`;

    const tuNumero = '5493764232429';
    window.open(`https://wa.me/${tuNumero}?text=${texto}`, '_blank');

    showToast('✅ ¡Solicitud enviada! Te contactaremos pronto.', '#4CAF50');
    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar solicitud';
  });
}

// ─── LIGHTBOX de galería ──────────────────────────────────────────
(function () {
  const backdrop = document.createElement('div');
  backdrop.className = 'lightbox-backdrop';
  backdrop.innerHTML = `
    <button class="lightbox-close" aria-label="Cerrar">✕</button>
    <img class="lightbox-img" src="" alt="" />
    <p class="lightbox-caption"></p>
  `;
  document.body.appendChild(backdrop);

  const lbImg     = backdrop.querySelector('.lightbox-img');
  const lbCaption = backdrop.querySelector('.lightbox-caption');
  const lbClose   = backdrop.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbImg.alt = caption;
    lbCaption.textContent = caption;
    backdrop.style.display = 'flex';
    requestAnimationFrame(() => backdrop.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    backdrop.classList.remove('open');
    setTimeout(() => {
      backdrop.style.display = 'none';
      lbImg.src = '';
      document.body.style.overflow = '';
    }, 300);
  }

  document.querySelectorAll('.galeria-item').forEach(item => {
    item.addEventListener('click', () => {
      const img     = item.querySelector('img');
      const caption = item.querySelector('.galeria-overlay span');
      if (img) openLightbox(img.src, caption ? caption.textContent : '');
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

// ─── Active nav link al hacer scroll ─────────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ─── Smooth reveal de la navbar al cargar ────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
