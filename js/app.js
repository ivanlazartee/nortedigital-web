/* =========================================================
   NorteDigitalDev — sitio principal
   ========================================================= */

const WHATSAPP = "5493816755692"; // formato internacional, sin "+" ni espacios

// Cada link con data-wa abre WhatsApp con su mensaje ya escrito.
// Ej: data-wa="Hola! Quiero consultar por una carta digital con QR."
//  → https://wa.me/5493816755692?text=Hola!%20Quiero%20consultar...
document.querySelectorAll("[data-wa]").forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(link.dataset.wa)}`;
});

// El botón flotante de WhatsApp se esconde mientras se ve alguna zona
// marcada con data-oculta-wa (el inicio, la cabecera de cada página y el
// contacto, que ya tienen su propio botón).
const flotante = document.getElementById("wa-flotante");
const visibles = new Set();

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target)));
  flotante.classList.toggle("visible", visibles.size === 0);
});

document.querySelectorAll("[data-oculta-wa]").forEach((el) => observador.observe(el));
