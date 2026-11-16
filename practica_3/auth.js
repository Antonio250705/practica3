// =========================================================
//  LOGIN Y REGISTRO - Davante Academy
//  Valida los formularios y, si todo es correcto, muestra un
//  modal de Bootstrap informando al usuario (sin servidor real).
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!formLogin.checkValidity()) {
                formLogin.classList.add('was-validated');
                return;
            }

            mostrarModal('modalLogin');
        });
    }

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            // Las dos contraseñas deben coincidir
            const pass = document.getElementById('password');
            const confirmar = document.getElementById('password-confirm');
            if (pass.value !== confirmar.value) {
                confirmar.setCustomValidity('Las contraseñas no coinciden');
            } else {
                confirmar.setCustomValidity('');
            }

            if (!formRegistro.checkValidity()) {
                formRegistro.classList.add('was-validated');
                return;
            }

            mostrarModal('modalRegistro');
        });

        // Al corregir la confirmación se limpia el error
        const confirmar = document.getElementById('password-confirm');
        if (confirmar) {
            confirmar.addEventListener('input', () => confirmar.setCustomValidity(''));
        }
    }
});

function mostrarModal(id) {
    const el = document.getElementById(id);
    if (el) {
        bootstrap.Modal.getOrCreateInstance(el).show();
    }
}
