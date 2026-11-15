// =========================================================
//  PÁGINA DE PAGO (CHECKOUT) - Davante Academy
//  Lee el carrito guardado en localStorage, muestra el resumen
//  del pedido y gestiona el formulario de datos de pago.
//  Reutiliza el mismo 'carritoDavante' que usa carrito.js.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    pintarResumen();
    prepararFormateoCampos();

    const form = document.getElementById('form-pago');
    if (form) {
        form.addEventListener('submit', confirmarPago);
    }
});

// Lee el carrito desde localStorage
function obtenerCarrito() {
    try {
        const datos = localStorage.getItem('carritoDavante');
        return datos ? JSON.parse(datos) : [];
    } catch (e) {
        return [];
    }
}

// Pinta el resumen del pedido en la columna derecha
function pintarResumen() {
    const contenedor = document.getElementById('resumen-pedido');
    const totalEl = document.getElementById('resumen-total');
    const btnPagar = document.getElementById('btn-pagar');
    const carrito = obtenerCarrito();

    if (!contenedor) return;

    // Si el carrito está vacío, avisamos y bloqueamos el pago
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center text-muted py-3">
                <p class="mb-2">Tu carrito está vacío.</p>
                <a href="cursos.html" class="btn btn-outline-dark btn-sm">Ver cursos</a>
            </div>
        `;
        if (totalEl) totalEl.innerText = '0€';
        if (btnPagar) btnPagar.disabled = true;
        return;
    }

    let total = 0;
    contenedor.innerHTML = '';

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const fila = document.createElement('div');
        fila.className = 'd-flex justify-content-between align-items-center';
        fila.innerHTML = `
            <span>${item.nombre} <span class="text-muted">x${item.cantidad}</span></span>
            <span class="fw-semibold">${subtotal}€</span>
        `;
        contenedor.appendChild(fila);
    });

    if (totalEl) totalEl.innerText = total + '€';
    if (btnPagar) btnPagar.disabled = false;
}

// Formateo cómodo de los campos de tarjeta mientras se escribe
function prepararFormateoCampos() {
    const numero = document.getElementById('numero-tarjeta');
    if (numero) {
        numero.addEventListener('input', () => {
            // Deja solo dígitos y agrupa de 4 en 4
            let v = numero.value.replace(/\D/g, '').slice(0, 16);
            numero.value = v.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    const cad = document.getElementById('caducidad');
    if (cad) {
        cad.addEventListener('input', () => {
            let v = cad.value.replace(/\D/g, '').slice(0, 4);
            if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
            cad.value = v;
        });
    }

    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', () => {
            cvv.value = cvv.value.replace(/\D/g, '').slice(0, 4);
        });
    }
}

// Se ejecuta al enviar el formulario
function confirmarPago(e) {
    e.preventDefault();

    const form = document.getElementById('form-pago');

    // Validación nativa de HTML5 (campos required, email, etc.)
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        // Lleva el foco al primer campo inválido
        const primerError = form.querySelector(':invalid');
        if (primerError) primerError.focus();
        return;
    }

    // Comprobación extra: que el carrito no esté vacío
    if (obtenerCarrito().length === 0) {
        return;
    }

    // Vaciar el carrito tras la compra
    localStorage.removeItem('carritoDavante');
    if (typeof carrito !== 'undefined') carrito = [];
    if (typeof actualizarCarritoUI === 'function') actualizarCarritoUI();

    // Mostrar modal de éxito
    const modalEl = document.getElementById('modalExito');
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
}
