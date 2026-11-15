// =========================================================
//  CARRITO DE COMPRAS - Davante Academy
//  Mejoras frente a la versión anterior:
//   1. Ya NO se abre el modal de golpe al añadir un curso.
//      En su lugar aparece un aviso discreto (toast) abajo a la
//      derecha, para no interrumpir la navegación del usuario.
//   2. El carrito se guarda en localStorage, así se mantiene al
//      cambiar de página o al recargar (antes se vaciaba).
//   3. Los cursos repetidos se agrupan mostrando una cantidad
//      con botones + y -, en vez de duplicar líneas.
// =========================================================

// Estado global del carrito. Se intenta recuperar de localStorage.
let carrito = cargarCarrito();

// --- Persistencia -----------------------------------------
function cargarCarrito() {
    try {
        const datos = localStorage.getItem('carritoDavante');
        return datos ? JSON.parse(datos) : [];
    } catch (e) {
        return [];
    }
}

function guardarCarrito() {
    localStorage.setItem('carritoDavante', JSON.stringify(carrito));
}

// --- Acciones del carrito ---------------------------------

// Añade un curso. Si ya existe, incrementa su cantidad.
function agregarAlCarrito(nombre, precio) {
    const existente = carrito.find(item => item.nombre === nombre);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }

    guardarCarrito();
    actualizarCarritoUI();
    mostrarAviso(`"${nombre}" añadido al carrito`);
}

// Suma una unidad a un curso concreto
function sumarUnidad(nombre) {
    const item = carrito.find(i => i.nombre === nombre);
    if (item) {
        item.cantidad += 1;
        guardarCarrito();
        actualizarCarritoUI();
    }
}

// Resta una unidad; si llega a 0, elimina el curso
function restarUnidad(nombre) {
    const item = carrito.find(i => i.nombre === nombre);
    if (item) {
        item.cantidad -= 1;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(i => i.nombre !== nombre);
        }
        guardarCarrito();
        actualizarCarritoUI();
    }
}

// Elimina por completo un curso del carrito
function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    guardarCarrito();
    actualizarCarritoUI();
}

// Vacía el carrito entero
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarCarritoUI();
}

// --- Aviso discreto (toast) -------------------------------
// Crea un pequeño mensaje flotante abajo a la derecha que se va solo.
function mostrarAviso(texto) {
    let contenedor = document.getElementById('contenedor-avisos');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'contenedor-avisos';
        contenedor.className = 'position-fixed bottom-0 end-0 p-3';
        contenedor.style.zIndex = '1080';
        document.body.appendChild(contenedor);
    }

    const aviso = document.createElement('div');
    aviso.className = 'aviso-carrito shadow-sm';
    aviso.innerHTML = `
        <span class="me-2">✅</span>
        <span class="flex-grow-1">${texto}</span>
        <button type="button" class="btn btn-sm btn-dark ms-3" data-bs-toggle="modal" data-bs-target="#modalCompra">Ver carrito</button>
    `;
    contenedor.appendChild(aviso);

    // Se desvanece y desaparece a los 3,5 segundos
    setTimeout(() => {
        aviso.classList.add('aviso-saliendo');
        setTimeout(() => aviso.remove(), 400);
    }, 3500);
}

// --- Pintar la interfaz -----------------------------------
function actualizarCarritoUI() {
    const contenedorLista = document.getElementById('lista-carrito');
    const elementoTotal = document.getElementById('total-carrito');
    const btnTramitar = document.getElementById('btn-tramitar');

    // El contador del carrito aparece en el nav de TODAS las páginas
    const contadorBadge = document.getElementById('contador-carrito');
    const totalUnidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    if (contadorBadge) contadorBadge.innerText = totalUnidades;

    // El resto solo se pinta si existe el modal en esta vista
    if (!contenedorLista) return;

    contenedorLista.innerHTML = '';

    if (carrito.length === 0) {
        contenedorLista.innerHTML = `
            <div class="text-center py-4 text-muted">
                <p class="fs-1 mb-2">🛒</p>
                <p class="fw-semibold mb-0">Tu carrito está vacío.</p>
                <small>Añade cursos desde el catálogo para empezar.</small>
            </div>
        `;
        if (elementoTotal) elementoTotal.innerText = '0€';
        if (btnTramitar) btnTramitar.disabled = true;
        return;
    }

    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const divCurso = document.createElement('div');
        divCurso.className = 'd-flex justify-content-between align-items-center p-3 bg-light rounded border';
        divCurso.innerHTML = `
            <div>
                <h6 class="fw-bold mb-1 text-dark">${item.nombre}</h6>
                <small class="text-muted">${item.precio}€ por curso</small>
            </div>
            <div class="d-flex align-items-center gap-3">
                <!-- Control de cantidad -->
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-dark" onclick="restarUnidad('${item.nombre}')" title="Quitar uno">−</button>
                    <span class="fw-bold" style="min-width: 20px; text-align: center;">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-dark" onclick="sumarUnidad('${item.nombre}')" title="Añadir uno">+</button>
                </div>
                <span class="fw-bold fs-6" style="min-width: 60px; text-align: right;">${subtotal}€</span>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito('${item.nombre}')" title="Eliminar del carrito">🗑️</button>
            </div>
        `;
        contenedorLista.appendChild(divCurso);
    });

    if (elementoTotal) elementoTotal.innerText = total + '€';
    if (btnTramitar) btnTramitar.disabled = false;
}

// Al pulsar "Tramitar compra" se lleva al usuario a la página
// de checkout (pago.html) para introducir sus datos.
function tramitarCompra() {
    if (carrito.length === 0) return;

    // Cierra el modal del carrito antes de cambiar de página
    const modalElement = document.getElementById('modalCompra');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }

    window.location.href = 'pago.html';
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', actualizarCarritoUI);
