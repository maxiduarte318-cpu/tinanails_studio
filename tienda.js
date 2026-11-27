/* ==============================
   TIENDA — tienda.js
   ============================== */
const WA_NUMBER = '5493765406970';

function pedirPorWhatsApp(lineas) {
  const texto = encodeURIComponent(lineas.join('\n'));
  window.open(`https://wa.me/${WA_NUMBER}?text=${texto}`, '_blank');
}

const btnStock = document.getElementById('btnPedirStock');
if (btnStock) {
  btnStock.addEventListener('click', () => {
    const diseno = document.getElementById('disenoStock').value;
    pedirPorWhatsApp([
      'Hola! Quiero pedir unas Press On 💅',
      '',
      '*Producto:* Press On (en stock)',
      `*Diseño:* ${diseno}`,
      '*Precio:* $5.000'
    ]);
  });
}

const btnCustom = document.getElementById('btnPedirCustom');
if (btnCustom) {
  btnCustom.addEventListener('click', () => {
    const idea = document.getElementById('disenoCustom').value.trim();
    pedirPorWhatsApp([
      'Hola! Quiero pedir unas Press On personalizadas 💅',
      '',
      '*Producto:* Press On personalizadas',
      `*Mi idea:* ${idea || 'Te la cuento por acá'}`,
      '*Precio:* $5.000'
    ]);
  });
}
