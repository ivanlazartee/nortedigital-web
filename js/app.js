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

// ---------- Precios en pesos, con referencia en dólares ----------
// Solo en las páginas que tienen elementos con data-ars (Servicios).
// El precio en pesos es fijo y va grande. Si responde la API del dólar blue,
// debajo se muestra el valor aproximado en dólares, redondeado de a 5.
// Ejemplo con el blue a $1.565 (venta):
//   $250.000 ÷ 1.565 = 159,7 → redondeado de a 5: USD 160
//   grande: "$250.000"   chico: "≈ USD 160"
const conPrecio = document.querySelectorAll("[data-ars]");

const pesos = (n) => "$" + n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

function mostrarDolares(venta, fecha) {
  conPrecio.forEach((el) => {
    const ars = Number(el.dataset.ars);
    const sufijo = el.dataset.sufijo || "";
    const usd = Math.max(5, Math.round(ars / venta / 5) * 5);
    const secundario = el.querySelector(".precio__secundario");
    secundario.textContent = `≈ USD ${usd}${sufijo}`;
    secundario.hidden = false;
  });

  const nota = document.getElementById("nota-dolar");
  if (nota) {
    const hora = fecha.toLocaleString("es-AR", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
    nota.textContent = `Valores en dólares aproximados, con el dólar blue (venta ${pesos(venta)}, actualizado el ${hora}).`;
    nota.hidden = false;
  }
}

async function cargarDolar() {
  if (!conPrecio.length) return;
  try {
    const resp = await fetch("https://dolarapi.com/v1/dolares/blue", { signal: AbortSignal.timeout(6000) });
    if (!resp.ok) return;
    const datos = await resp.json();
    if (datos.venta > 0) mostrarDolares(datos.venta, new Date(datos.fechaActualizacion));
  } catch (e) {
    // Si la API no responde, la página queda solo con los precios en pesos
  }
}

cargarDolar();
