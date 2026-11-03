// Estado global del carrito
let carrito = [];

// Función para añadir un curso al carrito
function agregarAlCarrito(nombre, precio) {
    carrito.push({ id: Date.now(), nombre: nombre, precio: precio });
    actualizarCarritoUI();
    
    // Abre el modal automáticamente al añadir
    const modalElement = document.getElementById('modalCompra');
    if (modalElement) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    }
}

// Función para eliminar un curso por su ID único
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarritoUI();
}

// Actualiza la interfaz visual del carrito, precios y contador en todas las páginas
function actualizarCarritoUI() {
    const contenedorLista = document.getElementById('lista-carrito');
    const elementoTotal = document.getElementById('total-carrito');
    const contadorBadge = document.getElementById('contador-carrito');
    const btnTramitar = document.getElementById('btn-tramitar');

    if (!contenedorLista) return; // Si no existe el modal en esta vista, se detiene

    contenedorLista.innerHTML = '';

    if (carrito.length === 0) {
        contenedorLista.innerHTML = `
            <div class="text-center py-4 text-muted">
                <p class="fs-1 mb-2">🛒</p>
                <p class="fw-semibold mb-0">Tu carrito está vacío.</p>
            </div>
        `;
        if (elementoTotal) elementoTotal.innerText = '0€';
        if (contadorBadge) contadorBadge.innerText = '0';
        if (btnTramitar) btnTramitar.disabled = true;
        return;
    }

    let total = 0;

    carrito.forEach(item => {
        total += item.precio;

        const divCurso = document.createElement('div');
        divCurso.className = 'd-flex justify-content-between align-items-center p-3 bg-light rounded border';
        divCurso.innerHTML = `
            <div>
                <h6 class="fw-bold mb-1 text-dark">${item.nombre}</h6>
                <small class="text-muted">Formación Davante Academy</small>
            </div>
            <div class="d-flex align-items-center gap-3">
                <span class="fw-bold fs-6">${item.precio}€</span>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${item.id})" title="Eliminar del carrito">
                    🗑️ Borrar
                </button>
            </div>
        `;
        contenedorLista.appendChild(divCurso);
    });

    if (elementoTotal) elementoTotal.innerText = total + '€';
    if (contadorBadge) contadorBadge.innerText = carrito.length;
    if (btnTramitar) btnTramitar.disabled = false;
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', actualizarCarritoUI);