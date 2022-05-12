/* Muestro cantidad del carrito en el NavBar */
cantidadEnCarrito();

let formulario = document.querySelector('#formulario');
let inputs = formulario.querySelectorAll('.form-control');
let boton = document.querySelector('#formulario button');
let errores = 0;

inputs.forEach(input => {
    // Inicializo inputs con nada
    input.value = '';
});

boton.addEventListener('click', (e) => {
    e.preventDefault();

    let formulario = e.target.parentElement;
    let inputs = formulario.querySelectorAll('.form-control');

    inputs.forEach(input => {
        validarCampos(input);
    });
});
///////////////
/* FUNCIONES */
///////////////
function cantidadEnCarrito() {

    let carrito = JSON.parse(localStorage.getItem('carrito'));
    let cant_carro = carrito.juegos.length;

    let punto_rojo = document.querySelector('.icono-carro div');

    let icono_carro = document.querySelector('.icono-carro');

    if (cant_carro > 0) {
        punto_rojo.classList.remove('d-none');
        punto_rojo.innerHTML = cant_carro;

        icono_carro.classList.remove('d-none');
    } else { // Si el carrito está vacío, oculto el icono        
        icono_carro.classList.add('d-none');
    }
}

function validarCampos(input) {
    let ex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let valor = input.value;
    let p;

    switch (input.name) {
        case "correo":

            p = document.querySelector('#error_mail');
            p.classList.add('d-none');

            if (ex.test(valor)) {
                input.classList.add('input_correcto');
                input.classList.remove('input_incorrecto');
            } else {
                input.classList.remove('input_correcto');
                input.classList.add('input_incorrecto');

                p.classList.remove('d-none');
                p.textContent = 'Formato de correo incorrecto';
            }
            break;
        case "nombre":

            p = document.querySelector('#error_nombre');
            p.classList.add('d-none');

            if (valor.length < 3) {
                input.classList.remove('input_correcto');
                input.classList.add('input_incorrecto');

                p.classList.remove('d-none');
                p.textContent = 'Ingrese un nombre correcto';
            } else {
                input.classList.add('input_correcto');
                input.classList.remove('input_incorrecto');
            }
            break;
        case "asunto":

            p = document.querySelector('#error_asunto');
            p.classList.add('d-none');

            if (valor.length < 3) {
                errores += 1;
                input.classList.remove('input_correcto');
                input.classList.add('input_incorrecto');

                p.classList.remove('d-none');
                p.textContent = 'Ingrese un asunto';
            } else {
                input.classList.add('input_correcto');
                input.classList.remove('input_incorrecto');
            }
            break;

        case "mensaje":

            p = document.querySelector('#error_msj');
            p.classList.add('d-none');

            if (valor.length < 5) {
                errores += 1;
                input.classList.remove('input_correcto');
                input.classList.add('input_incorrecto');

                p.classList.remove('d-none');
                p.textContent = 'Ingrese mensaje a enviar';
            } else {
                input.classList.add('input_correcto');
                input.classList.remove('input_incorrecto');
            }
            break;
        default:
            break;
    }
}