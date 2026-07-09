// =============================================
//   CLUB LITERARIO — Tienda de libros usados
//   tienda.js
// =============================================

// ---- Catálogo de libros ----
// Para agregar un libro nuevo, copiá un objeto y cambiá los datos.
// El campo "cover" acepta:
//   - URL de OpenLibrary: "https://covers.openlibrary.org/b/isbn/TU-ISBN-M.jpg"
//   - Imagen propia:      "img/portadas/nombre-del-archivo.jpg"

const libros = [
  {
    id: 1,
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    cat: "novela",
    price: 1800,
    condition: "Muy bueno",
    cover: "portadas/portada1.jpg"
  },
  {
    id: 2,
    title: "Rayuela",
    author: "Julio Cortázar",
    cat: "novela",
    price: 2200,
    condition: "Bueno",
    cover: "https://covers.openlibrary.org/b/isbn/9789500396608-M.jpg"
  },
  {
    id: 3,
    title: "Ficciones",
    author: "Jorge Luis Borges",
    cat: "cuento",
    price: 1500,
    condition: "Muy bueno",
    cover: "portadas/portada2.jpg"
  },
  {
    id: 4,
    title: "El Aleph",
    author: "Jorge Luis Borges",
    cat: "cuento",
    price: 1400,
    condition: "Regular",
    cover: "portadas/portada3.jpg"
  },
  {
    id: 5,
    title: "Veinte poemas de amor",
    author: "Pablo Neruda",
    cat: "poesía",
    price: 900,
    condition: "Muy bueno",
    cover: "portadas/portada4.jpg"
  },
  {
    id: 6,
    title: "La casa de Bernarda Alba",
    author: "Federico García Lorca",
    cat: "teatro",
    price: 1100,
    condition: "Bueno",
    cover: "https://covers.openlibrary.org/b/isbn/9788437604183-M.jpg"
  },
  {
    id: 7,
    title: "El túnel",
    author: "Ernesto Sabato",
    cat: "novela",
    price: 1600,
    condition: "Bueno",
    cover: "https://covers.openlibrary.org/b/isbn/9789504912576-M.jpg"
  },
  {
    id: 8,
    title: "Recuerdo de la muerte",
    author: "Miguel Bonasso",
    cat: "ensayo",
    price: 1300,
    condition: "Regular",
    cover: "https://covers.openlibrary.org/b/isbn/9789505811243-M.jpg"
  },
  {
    id: 9,
    title: "Fervor de Buenos Aires",
    author: "Jorge Luis Borges",
    cat: "poesía",
    price: 1000,
    condition: "Muy bueno",
    cover: "https://covers.openlibrary.org/b/isbn/9789500394291-M.jpg"
  },
  {
    id: 10,
    title: "Santa Evita",
    author: "Tomás Eloy Martínez",
    cat: "novela",
    price: 1700,
    condition: "Bueno",
    cover: "https://covers.openlibrary.org/b/isbn/9789507314230-M.jpg"
  },
  {
    id: 11,
    title: "La clase de griego",
    author: "Han Kang",
    cat: "novela",
    price: 24000,
    condition: "Excelente",
    cover: "portadas/portada5.jpg"
  },
  {
    id: 12,
    title: "La vegetariana",
    author: "Han Kang",
    cat: "novela",
    price: 25000,
    condition: "Excelente",
    cover: "portadas/portada7.jpg"
  }
];

// ---- Estado de la aplicación ----
let carrito = {};          // { id: { ...libro, qty: N } }
let filtroActivo = "todos";

// ---- Helpers ----
function formatPrecio(n) {
  return "$" + n.toLocaleString("es-AR");
}

// ---- Renderizar catálogo ----
function renderLibros() {
  const grid = document.getElementById("booksGrid");

  const visibles = filtroActivo === "todos"
    ? libros
    : libros.filter(b => b.cat === filtroActivo);

  if (visibles.length === 0) {
    grid.innerHTML = '<p class="no-results">No hay libros en esta categoría por ahora.</p>';
    return;
  }

  grid.innerHTML = visibles.map(libro => {
    const enCarrito = !!carrito[libro.id];
    return `
      <div class="book-card">
        <div class="book-cover">
          <img
            src="${libro.cover}"
            alt="Portada de ${libro.title}"
            onerror="this.parentElement.innerHTML='<p class=\\'book-cover-placeholder\\'>${libro.title}</p>'"
          >
        </div>
        <span class="book-cat">${libro.cat}</span>
        <p class="book-title">${libro.title}</p>
        <p class="book-author">${libro.author}</p>
        <p class="book-condition">★ ${libro.condition}</p>
        <p class="book-price">${formatPrecio(libro.price)}</p>
        <button
          class="add-btn ${enCarrito ? 'in-cart' : ''}"
          onclick="${enCarrito ? '' : 'agregarAlCarrito(' + libro.id + ')'}"
          ${enCarrito ? 'disabled' : ''}
        >
          ${enCarrito ? '✓ Agregado' : '+ Agregar'}
        </button>
      </div>
    `;
  }).join("");
}

// ---- Renderizar carrito ----
function renderCarrito() {
  const items = Object.values(carrito);
  const countEl    = document.getElementById("cartCount");
  const itemsEl    = document.getElementById("cartItems");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const totalCantidad = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrecio   = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  countEl.textContent = totalCantidad;
  document.getElementById("subtotal").textContent = formatPrecio(totalPrecio);
  document.getElementById("totalAmt").textContent = formatPrecio(totalPrecio);
  checkoutBtn.disabled = totalCantidad === 0;

  if (items.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    return;
  }

  itemsEl.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-price">${formatPrecio(item.price)} c/u</p>
        <div class="qty-controls">
          <button class="qty-btn" onclick="cambiarCantidad(${item.id}, -1)" aria-label="Reducir cantidad">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="cambiarCantidad(${item.id}, 1)" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="quitarDelCarrito(${item.id})" aria-label="Eliminar ${item.title}">×</button>
    </div>
  `).join("");
}

// ---- Acciones del carrito ----
function agregarAlCarrito(id) {
  const libro = libros.find(b => b.id === id);
  if (!libro) return;

  if (carrito[id]) {
    carrito[id].qty++;
  } else {
    carrito[id] = { ...libro, qty: 1 };
  }

  renderCarrito();
  renderLibros();
}

function cambiarCantidad(id, delta) {
  if (!carrito[id]) return;

  carrito[id].qty += delta;

  if (carrito[id].qty <= 0) {
    delete carrito[id];
  }

  renderCarrito();
  renderLibros();
}

function quitarDelCarrito(id) {
  delete carrito[id];
  renderCarrito();
  renderLibros();
}

// ---- Modal de pedido ----
function abrirModal() {
  const items = Object.values(carrito);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const resumen = items.map(i => `${i.qty}× ${i.title}`).join(" · ");

  document.getElementById("orderSummaryMini").innerHTML =
    `<strong>${resumen}</strong><br>Total: ${formatPrecio(total)}`;

  document.getElementById("modalOverlay").classList.add("open");
}

function cerrarModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}

function enviarPedido() {
  const nombre  = document.getElementById("fName").value.trim();
  const telefono = document.getElementById("fPhone").value.trim();
  const email   = document.getElementById("fEmail").value.trim();
  const direccion = document.getElementById("fAddr").value.trim();

  if (!nombre || !telefono || !email || !direccion) {
    alert("Por favor completá todos los campos obligatorios.");
    return;
  }

  // Mostrar mensaje de confirmación
  document.getElementById("modalContent").innerHTML = `
    <div class="success-msg">
      <div class="success-icon">✅</div>
      <h3>¡Pedido recibido!</h3>
      <p>
        Te vamos a contactar a <strong>${email}</strong>
        para coordinar la entrega en ${direccion}.
        ¡Gracias por apoyar al Club Literario!
      </p>
      <button class="submit-btn" style="margin-top: 1.25rem" onclick="finalizarPedido()">
        Cerrar
      </button>
    </div>
  `;
}

function finalizarPedido() {
  carrito = {};
  renderCarrito();
  renderLibros();
  cerrarModal();
}

// ---- Filtros ----
document.getElementById("filters").addEventListener("click", function(e) {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  filtroActivo = btn.dataset.cat;
  renderLibros();
});

// ---- Botón confirmar pedido ----
document.getElementById("checkoutBtn").addEventListener("click", abrirModal);

// ---- Cerrar modal ----
document.getElementById("closeModalBtn").addEventListener("click", cerrarModal);

// ---- Botón enviar formulario ----
document.getElementById("submitBtn").addEventListener("click", enviarPedido);

// ---- Cerrar modal al hacer click afuera ----
document.getElementById("modalOverlay").addEventListener("click", function(e) {
  if (e.target === this) cerrarModal();
});

// ---- Inicializar ----
renderLibros();
renderCarrito();
