moment.locale('es');
//
let listaJuegosNuevos = [];
cargoVectorJuegosProximos();
//

// Simulo una demora de 1 seg que carga los juegos proximos
setTimeout(() => {
    let loader = document.getElementById('loader');
    let contenedor_proximos = document.getElementById('contenedor_proximos');

    loader.classList.add('d-none');
    contenedor_proximos.classList.remove('d-none');

    agregarJuegosProximos();

    let btnProximos = document.querySelectorAll('.btnJuego');
    btnProximos.forEach(btn => {
        btn.addEventListener('click', () => {

            let idJuego = btn.previousElementSibling.textContent;
            btn.setAttribute('href', `./pages/juegoBase.html?id=${idJuego}&proximo=S`);
        });
    });

}, 1000);


// Miro la cantidad de productos en el carro, si hay > de 1, 
// muestro el punto rojo en el icono del carrito en la barra de navegacion
cantidadEnCarrito();

/* FUNCIONES */

function cargoVectorJuegosProximos() {

    // Hice el archivo json y hago el fetch desde GITHUB 
    fetch('https://raw.githubusercontent.com/alloisa2005/ludotecapp/main/data/juegosProximos.json')
        .then(res => res.json())
        .then(datos => {
            listaJuegosNuevos = datos;
        });

    // Ordeno la lista en este caso por orden de fecha de llegada
    listaJuegosNuevos = ordenoLista(listaJuegosNuevos, 'fecha');
}

function agregarJuegosProximos() {

    let recien_llegados = document.querySelector('#recien_llegados');

    listaJuegosNuevos.forEach(juego => {
        recien_llegados.innerHTML += juegoCardProximo(juego);
    });

}

function juegoCardProximo(juego) {

    let { nombre, fecha, precio, imagenes: { portada }, descripcion: { edad, jugadores, tiempo: { desde } } } = juego;

    return `    
    <div class="row recien_llegados_card justify-content-center">
    <div class="col-12 col-sm-6">
        <img src="${portada || "../images/imageError.jpg"}" alt="${nombre}">
    </div>
    <div class="col-12 col-sm-6 d-flex flex-column justify-content-evenly">
        <div class="d-flex flex-row justify-content-around">
            <div class="d-flex flex-row align-items-center justify-content-center py-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  </svg>
                <p class="text-center">${jugadores.desde} - ${jugadores.hasta}</p>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-stopwatch" viewBox="0 0 16 16">
                    <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z"/>
                    <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z"/>
                  </svg>
                <p class="text-center">${desde}'</p>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                <p>${edad}</p>
            </div>
        </div>
        <h3>${nombre}</h3>
        <h4>${moment(fecha).format('L') + ' <span class="span_fecha">   (' + moment(fecha, "YYYYMMDD").fromNow() + ')</span>'}</h4>        
        <h4 class="precio">$ ${separadorMiles(precio)}</h4>
        <p class="d-none">${juego.id}</p>
        <a class="btn btn-dark mb-3 btnJuego">Más info</a>
    </div>
</div>
    `;
}



function cantidadEnCarrito() {

    let cant_carro = 0;
    if (localStorage.getItem('carrito') != null) {

        let carrito = JSON.parse(localStorage.getItem('carrito'));
        cant_carro = carrito.juegos.length;
    }

    let icono_carro = document.querySelector('.icono-carro');

    if (cant_carro > 0) {

        let punto_rojo = document.querySelector('.icono-carro div');

        punto_rojo.classList.remove('d-none');
        punto_rojo.innerHTML = cant_carro;

        icono_carro.classList.remove('d-none');

    } else { // Si el carrito está vacío, oculto el icono        
        icono_carro.classList.add('d-none');
    }
}

function ordenoLista(listaJuegosNuevos, tipoFiltro) {
    switch (tipoFiltro) {
        case 'fecha':
            listaJuegosNuevos = listaJuegosNuevos.sort((a, b) => {
                if (a.fecha < b.fecha) { return -1; }
                if (a.fecha > b.fecha) { return 1; }
                return 0;
            });
            break;
        case 'nombre':
            listaJuegosNuevos = listaJuegosNuevos.sort((a, b) => {
                if (a.nombre < b.nombre) { return -1; }
                if (a.nombre > b.nombre) { return 1; }
                return 0;
            });
            break;
        default:
            break;
    }

    return listaJuegosNuevos;
}

function separadorMiles(num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&.');
}