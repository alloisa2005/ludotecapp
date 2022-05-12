moment.locale('es');
//
let listaJuegosNuevos = [];
let juegoParametro = {};
let proximo;
let carrito;

cargoParametrosYJuego();

///////////////
/* FUNCIONES */
///////////////
async function cargoParametrosYJuego() {

    let res = await fetch('../data/juegosProximos.json');
    let data = await res.json();
    listaJuegosNuevos = data;

    // Leo los parametros de la pagina, el id y si es un juego proximo o No (por ahora este parametro no lo uso)
    obtengoParametros();

    //
    contenidoPagina(juegoParametro);

    // Le doy estilo a la pagina por JS (me dejó de andar el compilador de SCSS, no se porq motivo)
    estiloPaginaBase();

    traerCarrito();
}

function obtengoParametros() {
    let GET_parameters = {};

    // Obtengo el id del juego que viene por parametro
    if (location.search) {
        let splitts = location.search.substring(1).split('&');

        for (let i = 0; i < splitts.length; i++) {
            let key_value_pair = splitts[i].split('=');

            if (!key_value_pair[0]) continue;
            GET_parameters[key_value_pair[0]] = key_value_pair[1] || true;
        }
    }

    idJuego = GET_parameters.id;
    proximo = GET_parameters.proximo;

    juegoParametro = listaJuegosNuevos.find(j => j.id == idJuego);
}

function estiloPaginaBase() {
    let juegoBase = document.querySelector('.juegoBase');
    let juegoBaseImg = document.querySelector('.juegoBase img');
    let juegoBaseP = document.querySelector('.juegoBase p');
    let linkBGG = document.getElementById('linkBGG');
    let linkYT = document.getElementById('linkYT');

    juegoBase.style.width = "100%";

    juegoBaseImg.style.width = "100%";
    juegoBaseImg.style.height = "400px";
    juegoBaseImg.style.objectfit = "contain";

    juegoBaseP.style.padding = "0 .5em";
    juegoBaseP.style.color = "rgb(85, 83, 83)";
    juegoBaseP.style.textAlign = "justify";
    juegoBaseP.style.fontSize = "1rem";

    linkBGG.style.color = "white";
    linkBGG.style.backgroundColor = "#1E234B";
    linkBGG.style.borderRadius = "15px";

    linkYT.style.fill = "#1E234B";
    linkYT.style.width = "62px";
    linkYT.style.height = "62px";
}

function contenidoPagina(juego) {

    let { fecha, nombre, descripcion: { sinopsis, jugadores, edad, tiempo, bgg, yt }, imagenes: { portada } } = juego;

    let mainContenido = document.getElementById('mainContenido');

    mainContenido.innerHTML = '';

    mainContenido.innerHTML = `
    <h2 class="jjww my-4 text-start">${nombre}</h2>

    <div class="row text-center">
        <div class="col-12 col-lg-4">
            <img class="w-100" src="${portada}" alt="Img ${nombre}">
        </div>
        <div class="text-start col-12 col-lg-8 flex-column align-items-center">
            <h5>Descripción</h5>
            <p class="mb-5">${sinopsis}</p>

            <div class="row text-center justify-content-center">
                <div class="col-4 col-lg-3 d-flex justify-content-center align-items-center my-2">
                    <img src="../images/cantidad.png" alt="Img Cantidad">
                    <p class="mx-2">${jugadores.desde}-${jugadores.hasta}</p>
                </div>

                <div class="col-4 col-lg-3 d-flex justify-content-center align-items-center my-2">
                    <img src="../images/edad.png" alt="Img Edad">
                    <p class="mx-2">${edad}+</p>
                </div>

                <div class="col-4 col-lg-3 d-flex justify-content-center align-items-center my-2">
                    <img src="../images/tiempo.png" alt="Img Tiempo">
                    <p class="mx-2">${tiempo.desde}'</p>
                </div>

                <div class="mt-4 col-12 d-flex  justify-content-around align-items-center">
                    <a id="linkBGG" href="${bgg}" target="_blank" class="fs-5 px-3 py-2">Link BGG</a>

                    <a class="d-flex align-items-center" href="#">
                        <p class="fs-5 mx-3">Como Jugar</p>
                        <a href="${yt}" target="_blank">
                            <svg id="linkYT" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
                                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                            </svg>
                        </a>                        
                    </a>
                </div>

            </div>
        </div>
    </div>
    `;
}

function traerCarrito() {

    if (localStorage.getItem('carrito') == null) {
        carrito = new Carrito(1, 'anthony', []);

        localStorage.setItem('carrito', JSON.stringify(carrito));
    } else {
        carrito = JSON.parse(localStorage.getItem('carrito'));
    }

    cantidadEnCarrito();
}

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