/* Defino clase Carrito */
class Carrito {

    constructor(id, usuario, juegos) {
        this.id = id;
        this.usuario = usuario;
        this.juegos = juegos;
    }

    agregarProducto(juego) {
        this.juegos.push(juego);
    }

    quitarProducto(juegoId) {
        let juego = this.juegos.find(el => el.id == juegoId);

        if (juego != undefined) {
            let pos = this.juegos.indexOf(juego);
            this.juegos.splice(pos, 1);
        }
    }

    total() {
        return this.juegos.reduce((acc, juego) => acc + juego.precio, 0);
    }

    detalle() {

        let msj = '';

        if (this.juegos.length == 0) {
            return `El carrito se encuentra vacío`;
        }

        msj = `Carrito id: ${this.id} - Usuario: ${this.usuario.nombre} ${this.usuario.apellido}\n`;

        if (this.juegos.length == 1) {
            msj += `\nEl carrito contiene ${this.juegos.length} juego:\n`;
        } else {
            msj += `\nEl carrito contiene ${this.juegos.length} juegos:\n`;
        }

        this.juegos.forEach(juego => {
            msj += ` - ${juego.nombre} - $ ${juego.precio}\n`;
        });

        msj += `\nMonto Total: $${this.total()}`;

        return msj;
    }

}
///////////////////////
/* Defino VARIABLES */
let listaJuegos = [];
let listaFavs = [];
let carrito;
let lista_productos = document.querySelector('.lista_productos');
let filtro_select = document.querySelector('#filtro_select');
let buscar_tit = document.querySelector('#buscar_tit');
let todos = document.querySelector('#todos');
let favoritos = document.querySelector('#favoritos');
let menor_1500 = document.querySelector('#menor_1500');
let menor_2500 = document.querySelector('#menor_2500');
let hasta_4000 = document.querySelector('#hasta_4000');
let mayor_4000 = document.querySelector('#mayor_4000');

/* Buscar por rango de precios */
let buscar_min = document.querySelector('#buscar_min');
let buscar_max = document.querySelector('#buscar_max');
//
let cat_cartas = document.querySelector('#cat_cartas');
let cat_tablero = document.querySelector('#cat_tablero');

/* Leo localStorage para el carrito y calculo la cantidad */
traerCarrito();

/* Leo localStorage para los favoritos */
traerFavoritos();

cargoVectorJuegos()
    .then(res => {

        listaJuegos = res;

        /* Cargo la lista de juegos por defecto y sus favoritos */
        listaJuegos.forEach(juego => {

            lista_productos.innerHTML += cardJuego(juego);
        });

        /* A la lista por defecto miro cuales estan en favoritos */
        let nueva_lista = Array.from(lista_productos.children);
        nueva_lista.forEach(n => {
            let id_juego = n.children[0].textContent;
            let anchor = n.children[1];

            let existe = listaFavs.find(el => el.id == id_juego);
            if (existe != undefined) {
                anchor.textContent = '♥️';
            }
        });
        /* FIN - Cargo la lista de juegos por defecto y sus favoritos*/

        /* Agregar y quitar iconos cuando clickeamos en los corazones */
        let a_fav = document.querySelectorAll('.card_producto .fav');
        a_fav.forEach(fav => {

            fav.style.display = "flex";

            fav.addEventListener('click', (e) => {
                e.preventDefault();

                let cardBody = e.target.parentElement;
                let id_juego = cardBody.querySelector('.id_juego').textContent;
                let anchor = cardBody.querySelector('.fav');

                let juego = listaJuegos.find(el => el.id == id_juego);

                if (juego != undefined) {
                    let listaParcial = JSON.parse(localStorage.getItem('favoritos'));

                    let existe = listaParcial.find(el => el.id == juego.id);

                    if (existe == undefined) {
                        listaParcial.push(juego);
                        localStorage.setItem('favoritos', JSON.stringify(listaParcial));
                        anchor.textContent = '♥️';

                    } else {
                        let pos = listaParcial.indexOf(existe);
                        listaParcial.splice(pos, 1);
                        localStorage.setItem('favoritos', JSON.stringify(listaParcial));
                        anchor.textContent = '🤍';
                    }
                }
            });

        });

        /* Boton Comprar */
        let bi_cart_plus = document.querySelectorAll('.comprar');
        bi_cart_plus.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();

                let id_juego = el.parentElement.childNodes[1].textContent;
                let juego = listaJuegos.find(j => j.id == id_juego);

                /* Busco si existe ya en el carrito el juego, de lo contrario lo agrego */
                let encontre = carrito.juegos.find(j => j.id == juego.id);

                if (encontre == undefined) {

                    //Inicializo la cantidad en 1
                    juego.cantidad = 1;

                    /* No se porque no me funciona el metodo "agregarProducto" de la clase Carrito  */
                    carrito.juegos.push(juego);

                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    /* location.reload(); */
                    cantidadEnCarrito();
                }

                muestroToast(juego);

            });
        });
    });

// Buscar por nombre
filtro_select.addEventListener('change', () => {

    lista_productos.innerHTML = '';
    let lista = filtrarSelect(filtro_select.value);

    lista.forEach(juego => {
        lista_productos.innerHTML += cardJuego(juego);
    });

});

/* Opción "Todos" */
todos.addEventListener('click', (e) => {


    buscar_min.value = '';
    buscar_max.value = '';

    todos.classList.add('activo');
    favoritos.classList.remove('activo');
    menor_1500.classList.remove('activo');
    menor_2500.classList.remove('activo');
    hasta_4000.classList.remove('activo');
    mayor_4000.classList.remove('activo');
    cat_cartas.classList.remove('activo');
    cat_tablero.classList.remove('activo');

    lista_productos.innerHTML = '';
    let lista = filtrar(" ");

    lista.forEach(juego => {
        lista_productos.innerHTML += cardJuego(juego);
    });

    location.reload();

});

/* Opcion Favoritos */
favoritos.addEventListener('click', (e) => {

    todos.classList.remove('activo');
    favoritos.classList.add('activo');
    menor_1500.classList.remove('activo');
    menor_2500.classList.remove('activo');
    hasta_4000.classList.remove('activo');
    mayor_4000.classList.remove('activo');
    cat_cartas.classList.remove('activo');
    cat_tablero.classList.remove('activo');

    lista_productos.innerHTML = '';

    let lista = filtrar("7");

    lista.forEach(juego => {
        lista_productos.innerHTML += cardJuego(juego);
    });

    /* Boton Comprar */
    agregandoAlCarro();

});

/* Opción "Menores a $1500" */
menor_1500.addEventListener('click', (e) => {
    e.preventDefault();

    todos.classList.remove('activo');
    favoritos.classList.remove('activo');
    menor_1500.classList.add('activo');
    menor_2500.classList.remove('activo');
    hasta_4000.classList.remove('activo');
    mayor_4000.classList.remove('activo');
    cat_cartas.classList.remove('activo');
    cat_tablero.classList.remove('activo');

    lista_productos.innerHTML = '';
    let lista = filtrar("1");

    lista.forEach(juego => {
        lista_productos.innerHTML += cardJuego(juego);
    });

    agregandoAlCarro();
});

/* Opción "Hasta a $2500" */
menor_2500.addEventListener('click', (e) => {
    e.preventDefault();

    todos.classList.remove('activo');
    menor_1500.classList.remove('activo');
    menor_2500.classList.add('activo');
    hasta_4000.classList.remove('activo');
    mayor_4000.classList.remove('activo');
    cat_cartas.classList.remove('activo');
    cat_tablero.classList.remove('activo');

    lista_productos.innerHTML = '';
    let lista = filtrar("2");

    lista.forEach(juego => {
        lista_productos.innerHTML += cardJuego(juego);
    });

    agregandoAlCarro();
});

/* Opción "Hasta a $4000" */
hasta_4000.addEventListener('click', (e) => {
    e.preventDefault();

    todos.classList.remove('activo');
    menor_1500.classList.remove('activo');
    menor_2500.classList.remove('activo');
    hasta_4000.classList.add('activo');
    mayor_4000.classList.remove('activo');
    cat_cartas.classList.remove('activo');
    cat_tablero.classList.remove('activo');

    lista_productos.innerHTML = '';
    let lista = filtrar("3");

    lista.forEach(juego => {
        lista_productos.innerHTML += cardJuego(juego);
    });

    agregandoAlCarro();
});

/* Opción "Mayor a $4000" */
mayor_4000.addEventListener('click', (e) => {
    e.preventDefault();

    todos.classList.remove('activo');
    menor_1500.classList.remove('activo');
    menor_2500.classList.remove('activo');
    hasta_4000.classList.remove('activo');
    mayor_4000.classList.add('activo');
    cat_cartas.classList.remove('activo');
    cat_tablero.classList.remove('activo');

    lista_productos.innerHTML = '';
    let lista = filtrar("4");

    lista.forEach(juego => {
        lista_productos.innerHTML += cardJuego(juego);
    });

    agregandoAlCarro();
});

/* Buscar por rango de precios */
buscar_min.addEventListener('keyup', (e) => {
    let min = parseFloat(buscar_min.value);
    let max = parseFloat(buscar_max.value);

    if (e.keyCode == 13) {

        quitoClase('activo');

        if (min == undefined || isNaN(min)) {
            min = 0.0;
        }

        if (max == undefined || isNaN(max)) {
            max = 999999.00;
        }

        lista_productos.innerHTML = '';
        let lista = listaJuegos.filter(j => j.precio >= min && j.precio <= max);

        /* Ordeno de menor a mayor por precio */
        lista = lista.sort((a, b) => {
            if (a.precio < b.precio) { return -1; }
            if (a.precio > b.precio) { return 1; }
            return 0;
        });

        lista.forEach(juego => {
            lista_productos.innerHTML += cardJuego(juego);
        });
    }
});

buscar_max.addEventListener('keyup', (e) => {
    let min = parseFloat(buscar_min.value);
    let max = parseFloat(buscar_max.value);

    if (e.keyCode == 13) {

        quitoClase('activo');

        if (min == undefined || isNaN(min)) {
            min = 0.0;
        }

        if (max == undefined || isNaN(max)) {
            max = 999999.00;
        }

        lista_productos.innerHTML = '';
        let lista = listaJuegos.filter(j => j.precio >= min && j.precio <= max);

        /* Ordeno de menor a mayor por precio */
        lista = lista.sort((a, b) => {
            if (a.precio < b.precio) { return -1; }
            if (a.precio > b.precio) { return 1; }
            return 0;
        });

        lista.forEach(juego => {
            lista_productos.innerHTML += cardJuego(juego);
        });
    }
});

/* Opción Titulo */
buscar_tit.addEventListener('keyup', (e) => {

    if (e.keyCode == 13) { // Clickeamos ENTER y hacemos la busqueda

        quitoClase('activo');

        let cadena = buscar_tit.value;

        lista_productos.innerHTML = '';
        let lista = buscarPorTitulo(cadena);

        lista.forEach(juego => {
            lista_productos.innerHTML += cardJuego(juego);
        });
    }
});

/* Categoría Cartas */
cat_cartas.addEventListener('click', (e) => {
    e.preventDefault();

    todos.classList.remove('activo');
    favoritos.classList.remove('activo');
    menor_1500.classList.remove('activo');
    menor_2500.classList.remove('activo');
    hasta_4000.classList.remove('activo');
    mayor_4000.classList.remove('activo');
    cat_cartas.classList.add('activo');
    cat_tablero.classList.remove('activo');

    lista_productos.innerHTML = '';
    let lista = filtrar("5");

    lista.forEach(juego => {
        lista_productos.innerHTML += cardJuego(juego);
    });

    agregandoAlCarro();
});

/* Categoría Tablero */
cat_tablero.addEventListener('click', (e) => {
    e.preventDefault();

    todos.classList.remove('activo');
    favoritos.classList.remove('activo');
    menor_1500.classList.remove('activo');
    menor_2500.classList.remove('activo');
    hasta_4000.classList.remove('activo');
    mayor_4000.classList.remove('activo');
    cat_cartas.classList.remove('activo');
    cat_tablero.classList.add('activo');

    lista_productos.innerHTML = '';
    let lista = filtrar("6");

    lista.forEach(juego => {
        lista_productos.innerHTML += cardJuego(juego);
    });

    agregandoAlCarro();
});
///////////////
/* FUNCIONES */
///////////////

async function cargoVectorJuegos() {

    try {
        // Hice el archivo json y hago el fetch desde GITHUB porq no me funcionaba local cuando subía la página            
        let res = await fetch('../data/juegosTienda.json');
        let data = await res.json();
        listaJuegos = data;

        /* Paso los nombres de los juegos a UpperCase */
        listaJuegos.forEach(j => {
            j.nombre = j.nombre.toUpperCase();
        });

        /* Ordeno la lista alfabeticamente */
        return listaJuegos.sort((a, b) => {
            if (a.nombre < b.nombre) { return -1; }
            if (a.nombre > b.nombre) { return 1; }
            return 0;
        });

    } catch (e) {
        console.log(e);
    }
}

/* Armo el Card del juego a mostrar */
function cardJuego(juego) {

    let { id, nombre, precio, imagenes: { portada } } = juego;

    return `
        <div class="card_producto">
            <p class="id_juego d-none">${id}</p>
            <a class="fav" href="#">🤍</a>
            <img src="${portada || "../images/imageError.jpg"}" alt="Imagen ${nombre}">
            <p class="titulo">${nombre}</p>
            <p class="precio">$ ${separadorMiles(precio)}</p>
            <a class="comprar" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z"/>
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
            </a>
        </div>
    `;


}

function buscarPorTitulo(cadena) {

    let listaFiltrada = [];

    listaFiltrada = listaJuegos.filter(j => j.nombre.includes(cadena.toUpperCase()));

    return listaFiltrada;
}

function filtrar(tipoFiltro) {
    let listaFiltrada = [];

    switch (tipoFiltro) {
        case "1":
            /* menores a $1500 */
            listaFiltrada = listaJuegos.filter(j => j.precio <= 1500);
            break;

        case "2":
            /* menores a $2500 */
            listaFiltrada = listaJuegos.filter(j => j.precio <= 2500);
            break;
        case "3":
            /* hasta $4000 */
            listaFiltrada = listaJuegos.filter(j => j.precio <= 4000);
            break;

        case "4":
            /* más de $4000 */
            listaFiltrada = listaJuegos.filter(j => j.precio > 4000);
            break;

        case "5":
            /* Categoría CARTAS */
            listaFiltrada = listaJuegos.filter(j => j.categoria == 'cartas');
            break;

        case "6":
            /* Categoría TABLERO */
            listaFiltrada = listaJuegos.filter(j => j.categoria == 'tablero');
            break;
        case "7":
            /* FAVORITOS */
            listaFiltrada = JSON.parse(localStorage.getItem('favoritos'))
            break;
        default:

            listaFiltrada = listaJuegos;
            break;
    }

    return listaFiltrada;
}

function filtrarSelect(opcion) {
    let listaFiltrada = [];

    switch (opcion) {
        case "0":
            /* Nombre A a Z */
            listaFiltrada = listaJuegos.sort((a, b) => {
                if (a.nombre < b.nombre) { return -1; }
                if (a.nombre > b.nombre) { return 1; }
                return 0;
            });
            break;

        case "1":
            /* Nombre Z a A */
            listaFiltrada = listaJuegos.sort((a, b) => {
                if (a.nombre > b.nombre) { return -1; }
                if (a.nombre < b.nombre) { return 1; }
                return 0;
            });
            break;
        case "2":
            /* Precio, de mas bajo a mas alto */
            listaFiltrada = listaJuegos.sort((a, b) => {
                if (a.precio < b.precio) { return -1; }
                if (a.precio > b.precio) { return 1; }
                return 0;
            });
            break;

        case "3":
            /* Precio, de mas alto a mas bajo */
            listaFiltrada = listaJuegos.sort((a, b) => {
                if (a.precio > b.precio) { return -1; }
                if (a.precio < b.precio) { return 1; }
                return 0;
            });
            break;

        case "4":
            /* Juegos de CARTAS */
            listaFiltrada = listaJuegos.filter(j => j.categoria == 'cartas');
            break;

        case "5":
            /* Juegos de  TABLERO */
            listaFiltrada = listaJuegos.filter(j => j.categoria == 'tablero');
            break;
        default:
            listaFiltrada = listaJuegos;
            break;
    }

    return listaFiltrada;
}

function quitoClase(clase) {
    todos.classList.remove(clase);
    favoritos.classList.remove(clase);
    menor_1500.classList.remove(clase);
    menor_2500.classList.remove(clase);
    hasta_4000.classList.remove(clase);
    mayor_4000.classList.remove(clase);
    cat_cartas.classList.remove(clase);
    cat_tablero.classList.remove(clase);
}

function agregandoAlCarro() {

    let bi_cart_plus = document.querySelectorAll('.comprar');
    bi_cart_plus.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();

            let id_juego = el.parentElement.childNodes[1].textContent;
            let juego = listaJuegos.find(j => j.id == id_juego);

            /* Busco si existe ya en el carrito el juego, de lo contrario lo agrego */
            let encontre = carrito.juegos.find(j => j.id == juego.id);

            if (encontre == undefined) {

                //Inicializo la cantidad en 1
                juego.cantidad = 1;

                /* No se porque no me funciona el metodo "agregarProducto" de la clase Carrito  */
                carrito.juegos.push(juego);

                localStorage.setItem('carrito', JSON.stringify(carrito));
                //location.reload();
                cantidadEnCarrito();
            }
        });
    });

}

function traerCarrito() {

    carrito = JSON.parse(localStorage.getItem('carrito')) || null;

    if (carrito == null) {
        carrito = new Carrito(1, 'anthony', []);
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    cantidadEnCarrito();
}

function traerFavoritos() {

    if (localStorage.getItem('favoritos') != null) {
        listaFavs = JSON.parse(localStorage.getItem('favoritos'));
    } else {
        listaFavs = [];
        localStorage.setItem('favoritos', JSON.stringify(listaFavs));
    }
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



function cargarCorazones() {

    a_fav.forEach(fav => {

        fav.addEventListener('click', (e) => {
            e.preventDefault();

            let cardBody = e.target.parentElement;
            let id_juego = cardBody.querySelector('.id_juego').textContent;
            let anchor = cardBody.querySelector('.fav');

            let juego = listaJuegos.find(el => el.id == id_juego);

            if (juego != undefined) {
                let listaParcial = JSON.parse(localStorage.getItem('favoritos'));

                let existe = listaParcial.find(el => el.id == juego.id);

                if (existe == undefined) {
                    listaParcial.push(juego);
                    localStorage.setItem('favoritos', JSON.stringify(listaParcial));
                    anchor.textContent = '♥️';
                } else {
                    let pos = listaParcial.indexOf(existe);
                    listaParcial.splice(pos, 1);
                    localStorage.setItem('favoritos', JSON.stringify(listaParcial));
                    anchor.textContent = '🤍';
                }
            }
        });

    });

}

function separadorMiles(num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&.');
}

function muestroToast(juego) {

    Toastify({
        text: `${juego.nombre} agregado al carrito (Ver)`,
        className: "info",
        avatar: '../images/dicePortada.png',
        duration: 2500,
        destination: '../pages/carrito.html',
        gravity: "bottom",
        style: {
            background: "#212529",
            color: "white",
        }
    }).showToast();

}