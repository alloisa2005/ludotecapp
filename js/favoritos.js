cantidadEnCarrito();

function cantidadEnCarrito() {

    let carrito = JSON.parse(localStorage.getItem('carrito'));
    let cant_carro = carrito.juegos.length;

    let punto_rojo = document.querySelector('.icono-carro div');
    console.log(punto_rojo);

    if (cant_carro > 0) {
        punto_rojo.classList.remove('d-none');
        punto_rojo.innerHTML = cant_carro;
    }
}