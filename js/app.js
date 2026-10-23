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

// El botón flotante de WhatsApp aparece cuando el inicio ya no se ve
// y se esconde de nuevo sobre la sección de contacto (que ya tiene su botón).
const flotante = document.getElementById("wa-flotante");
const inicio = document.getElementById("inicio");
const contacto = document.getElementById("contacto");
let inicioVisible = true;
let contactoVisible = false;

const actualizarFlotante = () => {
  flotante.classList.toggle("visible", !inicioVisible && !contactoVisible);
};

new IntersectionObserver(([e]) => {
  inicioVisible = e.isIntersecting;
  actualizarFlotante();
}).observe(inicio);

new IntersectionObserver(([e]) => {
  contactoVisible = e.isIntersecting;
  actualizarFlotante();
}).observe(contacto);
