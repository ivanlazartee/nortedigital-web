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

// ---------- Precios en pesos con el dólar blue ----------
// Solo en las páginas que tienen elementos con data-usd (Servicios).
// Cuando llega el dólar, el precio en pesos pasa a ser el grande y el de
// dólares queda chico debajo. Ejemplo con el blue a $1.565 (venta):
//   USD 150 × 1.565 = $234.750 → redondeado a miles: $235.000
//   grande: "$235.000"   chico: "USD 150"
const conPrecio = document.querySelectorAll("[data-usd]");

const pesos = (n) => "$" + n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

function mostrarPesos(venta, fecha) {
  conPrecio.forEach((el) => {
    const usd = Number(el.dataset.usd);
    const sufijo = el.dataset.sufijo || "";
    const ars = Math.round((usd * venta) / 1000) * 1000;
    const principal = el.querySelector(".precio__principal");
    const secundario = el.querySelector(".precio__secundario");
    principal.textContent = `${pesos(ars)}${sufijo}`;
    secundario.textContent = `USD ${usd}${sufijo}`;
    secundario.hidden = false;
  });

  const nota = document.getElementById("nota-dolar");
  if (nota) {
    const hora = fecha.toLocaleString("es-AR", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
    nota.textContent = `Precios en pesos calculados con el dólar blue (venta ${pesos(venta)}, actualizado el ${hora}). Son aproximados y se confirman al pagar.`;
    nota.hidden = false;
  }
}

async function cargarDolar() {
  if (!conPrecio.length) return;
  try {
    const resp = await fetch("https://dolarapi.com/v1/dolares/blue", { signal: AbortSignal.timeout(6000) });
    if (!resp.ok) return;
    const datos = await resp.json();
    if (datos.venta > 0) mostrarPesos(datos.venta, new Date(datos.fechaActualizacion));
  } catch (e) {
    // Si la API no responde, la página queda solo con los precios en dólares
  }
}

cargarDolar();
