/* ==============================
   TINA NAILS STUDIO — presupuesto.js
   ============================== */

// ─── NAVBAR scroll (mismo comportamiento que en el resto del sitio) ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ─── BURGER menú móvil ────────────────────────────────────────────
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
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
}

// ─── TOAST ─────────────────────────────────────────────────────────
const toast = document.getElementById('toast');
function showToast(msg, color = '#2C2C2C') {
  if (!toast) return;
  toast.textContent = msg;
  toast.style.background = color;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3600);
}

// ─── FORMATO DE MONEDA ─────────────────────────────────────────────
function formatARS(num) {
  return '$' + Math.round(num).toLocaleString('es-AR');
}

// ─── CALCULADORA DE PRESUPUESTO ────────────────────────────────────
const cards          = Array.from(document.querySelectorAll('.presu-card'));
const resumenLista   = document.getElementById('resumenLista');
const totalEstimado  = document.getElementById('totalEstimado');
const presuNota      = document.getElementById('presuNota');
const btnEnviarPresu = document.getElementById('btnEnviarPresu');

function calcular() {
  let total = 0;
  let hayDesde = false;
  const seleccionados = [];

  cards.forEach(card => {
    const checkbox = card.querySelector('.presu-checkbox');
    const qtyVal   = card.querySelector('.qty-val');
    const precio   = parseFloat(card.dataset.precio);
    const desde    = card.dataset.desde === 'true';
    const nombre   = card.dataset.nombre;

    if (checkbox.checked) {
      const cantidad = parseInt(qtyVal.textContent, 10);
      const subtotal = precio * cantidad;
      total += subtotal;
      if (desde) hayDesde = true;

      seleccionados.push({ nombre, cantidad, subtotal, desde });
    }
  });

  // Actualizar lista del resumen
  if (seleccionados.length === 0) {
    resumenLista.innerHTML = '<p class="presu-vacio">Todavía no elegiste ningún servicio.</p>';
    btnEnviarPresu.classList.remove('enabled');
    btnEnviarPresu.disabled = true;
  } else {
    resumenLista.innerHTML = seleccionados.map(item => `
      <div class="resumen-item">
        <span class="ri-nombre">${item.nombre}${item.cantidad > 1 ? ` <small>x${item.cantidad}</small>` : ''}</span>
        <span class="ri-precio">${item.desde ? 'desde ' : ''}${formatARS(item.subtotal)}</span>
      </div>
    `).join('');
    btnEnviarPresu.classList.add('enabled');
    btnEnviarPresu.disabled = false;
  }

  totalEstimado.textContent = (hayDesde ? 'desde ' : '') + formatARS(total);
  presuNota.style.display = hayDesde ? 'block' : 'none';

  return { total, seleccionados };
}

cards.forEach(card => {
  const checkbox = card.querySelector('.presu-checkbox');
  const qtyVal   = card.querySelector('.qty-val');
  const minusBtn = card.querySelector('.qty-minus');
  const plusBtn  = card.querySelector('.qty-plus');

  checkbox.addEventListener('change', calcular);

  minusBtn.addEventListener('click', () => {
    let val = parseInt(qtyVal.textContent, 10);
    if (val > 1) {
      val -= 1;
      qtyVal.textContent = val;
      calcular();
    }
  });

  plusBtn.addEventListener('click', () => {
    let val = parseInt(qtyVal.textContent, 10);
    if (val < 10) {
      val += 1;
      qtyVal.textContent = val;
      calcular();
    }
  });
});

// ─── ENVIAR POR WHATSAPP ────────────────────────────────────────────
if (btnEnviarPresu) {
  btnEnviarPresu.addEventListener('click', () => {
    const { total, seleccionados } = calcular();
    if (seleccionados.length === 0) {
      showToast('💅 Elegí al menos un servicio para continuar.', '#C2577A');
      return;
    }

    let texto = `Hola! Quiero consultar por este autopresupuesto 🧮💅%0A%0A`;
    seleccionados.forEach(item => {
      texto += `• ${item.nombre}${item.cantidad > 1 ? ` x${item.cantidad}` : ''}: ${item.desde ? 'desde ' : ''}${formatARS(item.subtotal)}%0A`;
    });
    texto += `%0A*Total estimado:* ${seleccionados.some(s => s.desde) ? 'desde ' : ''}${formatARS(total)}`;

    const tuNumero = '5493764232429';
    window.open(`https://wa.me/${tuNumero}?text=${texto}`, '_blank');
  });
}

// Cálculo inicial
calcular();

window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
