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

let carro_vacio = document.getElementById('carro-vacio');
let carro_lleno = document.getElementById('carro-lleno');
//
let lista_carrito = document.querySelector('#lista_carrito');
let cant = document.querySelector('#cant');
//
//

let carrito;
traerCarrito();

cantidadEnCarrito();

let input_cant = document.querySelectorAll('.input_cant');

input_cant.forEach(input => {

    input.addEventListener('change', (e) => {

        if (parseInt(input.value) <= 0) {
            input.value = "0";
        }

        if (parseInt(input.value) >= 99) {
            input.value = "99";
        }

        let id_juego = input.nextElementSibling.children[0].textContent;

        carrito.juegos.forEach(j => {
            if (j.id == id_juego) {
                j.cantidad = parseInt(input.value);
            }
        });
        localStorage.setItem('carrito', JSON.stringify(carrito));

        let totalCarro = totalCarrito(carrito.juegos);
        let precioEnvio = (totalCarro > 0 && totalCarro < 10000) ? 500 : 0;


        let resumen_pedido = document.querySelector('.resumen_pedido');

        let subTotal = resumen_pedido.children[2];
        let envio = resumen_pedido.children[3];

        let total = resumen_pedido.children[4];

        subTotal.textContent = 'Sub Total ($): ' + totalCarro;
        envio.textContent = 'Envío ($): ' + precioEnvio;
        total.textContent = 'Total ($): ' + (precioEnvio + totalCarro);

    });

});


let foto_juego = document.querySelectorAll('.card_carrito a');
let btn_eliminar = document.querySelectorAll('.btn-eliminar');


btn_eliminar.forEach(btn => {

    let juego_id = btn.children[0].textContent;

    btn.addEventListener('click', (e) => {
        e.preventDefault();

        let juego = carrito.juegos.find(j => j.id == juego_id);
        let posicion = carrito.juegos.indexOf(juego);

        carrito.juegos.splice(posicion, 1);

        localStorage.setItem('carrito', JSON.stringify(carrito));

        lista_carrito.innerHTML = '';
        carrito.juegos.forEach(ju => {
            lista_carrito.innerHTML += cardCarrito(ju);
        });

        location.reload();
    });
});

// Trabajar con el RESUMEN DEL PEDIDO
let resumen_pedido = document.querySelector('.resumen_pedido');

window.addEventListener('click', (e) => {

    if (e.target.classList.contains('img-carro')) {
        let src = e.target.src;
        let id_juego = e.target.getAttribute('juegoid');

        console.log(id_juego);

        let modal_titulo = document.querySelector('#modal-titulo');
        let modal_img = document.querySelector('#modal-img');

        modal_img.setAttribute('src', src);
        modal_img.setAttribute('alt', 'Imagen Juego');

        let nombreJuego = carrito.juegos.find(j => j.id == id_juego).nombre;
        modal_titulo.textContent = nombreJuego;
    }

});

/* Para poner ENABLED el botón COMPRAR valido los inputs antes */
let envioNombre = document.querySelector('#envioNombre');
let envioTel = document.querySelector('#envioTel');
let envioDir = document.querySelector('#envioDir');
let envioLocal = document.querySelector('#envioLocal');
obtengoLocalizacion();

validoInputsCompra();

/* Boton COMPRAR (Lo que hago es vaciar el carrito y guardo la compra) */
let btn_comprar = document.getElementById('btn_comprar');
btn_comprar.addEventListener('click', (e) => {

    let carro = JSON.parse(localStorage.getItem('carrito'));

    /* Cuando hago una compra, guardo en el LS una especie de historia de las compras */
    guardoCompra(carro);

    localStorage.removeItem('carrito');
    let carrito = new Carrito(1, 'anthony', []);
    localStorage.setItem('carrito', JSON.stringify(carrito));

    //location.reload();
});

function traerCarrito() {

    /* Leo el carrito del localStorage, en caso de no exisitir creo un carro nuevo */
    if (localStorage.getItem('carrito') == null) {
        carrito = new Carrito(1, 'anthony', []);

        localStorage.setItem('carrito', JSON.stringify(carrito));
    } else {
        carrito = JSON.parse(localStorage.getItem('carrito'));
    }

    /* Si el carro esta vacío (de juegos), muestro un section que dice que no hay productos */
    /* de lo contrario, muestro el carro */

    lista_carrito.innerHTML = '';
    carrito.juegos.forEach(ju => {
        lista_carrito.innerHTML += cardCarrito(ju);
    });

    let totalCarro = totalCarrito(carrito.juegos);
    let precioEnvio = (totalCarro < 10000) ? 500 : 0;


    let resumen_pedido = document.querySelector('.resumen_pedido');
    let subTotal = resumen_pedido.children[2];
    let envio = resumen_pedido.children[3];
    let total = resumen_pedido.children[4];

    subTotal.textContent += totalCarro;
    envio.textContent += precioEnvio;
    total.textContent += (precioEnvio + totalCarro);


    total.style.color = "green";

    if (carrito.juegos.length == 0) {
        carro_vacio.classList.remove('d-none');
        carro_lleno.classList.add('d-none');
    } else {
        carro_lleno.classList.remove('d-none');
        carro_vacio.classList.add('d-none');
    }
}

function cardCarrito(juego) {

    let { id, nombre, precio, cantidad, imagenes: { portada } } = juego;

    return `
        <div class="card_carrito">
            <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <p class="d-none">${id}</p>
                <img class="img-carro" juegoid="${id}" src="${portada}" alt="Img ${nombre}">
            </a>

            <div class="carro_f">
                <div class="detalle_carrito">
                    <p>${nombre}</p>
                    <p>$ ${separadorMiles(precio)}</p>
                </div>
                <div class="carro_f_cant">
                    <p>Cantidad:</p>
                    <input class="input_cant" type="number" value="${cantidad}">

                    <a class="btn-eliminar" href="#">
                        <p class="d-none">${id}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </a>

                </div>
            </div>
        </div>
    `;
}

function totalCarrito(carro) {
    return carro.reduce((acc, el) => acc + (el.precio * el.cantidad), 0);
}

function cantidadEnCarrito() {

    let carrito = JSON.parse(localStorage.getItem('carrito'));
    let cant_carro = carrito.juegos.length;

    let punto_rojo = document.querySelector('.icono-carro div');


    if (cant_carro > 0) {
        punto_rojo.classList.remove('d-none');
        punto_rojo.innerHTML = cant_carro;
    }
}

function guardoCompra(carro) {

    let compras = [];
    let maximo = 0;
    if (localStorage.getItem('compras') != null) {
        compras = JSON.parse(localStorage.getItem('compras'));

        for (let i = 0; i < compras.length; i++) {
            if (compras[i].id > maximo) {
                maximo = compras[i].id;
            }
        }
    } else {
        maximo = 0;
    }
    maximo++;

    /* Si el usuario cambia la cantidad del input a 0 (cero), no lo guardo en la compra a ese elemento */

    /* Se me ocurrió guardar en un vector los id´s de los juegos que cantidad = 0 */
    let ids = [];
    carro.juegos.forEach(j => {
        if (j.cantidad == 0) {
            ids.push(j.id);
        }
    });

    /* Por cada elemento en ids los quito de carro.juegos (solo me quedo con los que tienen cantidad > 0) */
    ids.forEach(id => {
        let juego = carro.juegos.find(j => j.id == id);
        console.log(juego);
        let pos = carro.juegos.indexOf(juego);
        carro.juegos.splice(pos, 1);
    });

    /* Si todos los juegos de la compra tienen cantidad = 0 (cero), no guardo la compra directamente */
    if (carro.juegos.length != 0) {
        let compra = {
            id: maximo,
            usuario: envioNombre.value,
            telefono: envioTel.value,
            direccion: envioDir.value,
            localidad: envioLocal.value,
            fecha: new Date(),
            juegos: carro.juegos
        };

        compras.push(compra);
        localStorage.setItem('compras', JSON.stringify(compras));

        /* Muestro alerta con compra OK */
        swal({
                title: "Compra Finalizada",
                text: `Muchas gracias ${compra.usuario} por su compra, a más tardar en 48hs tendrá los productos en su domicilio`,
                icon: "success",
            })
            .then((value) => {
                if (value) {
                    location.reload();
                }
            });
    } else {
        /* Muestro alerta diciendo que las cantidades son nulas */
        swal({
            title: "Carrito Vacío",
            text: "El carrito no tiene productos, verifique las cantidades",
            icon: "warning",
        });
    }

    //location.reload();
}

function obtengoLocalizacion() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            let coordenadas = position.coords;

            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordenadas.latitude}&lon=${coordenadas.longitude}`)
                .then(res => res.json())
                .then(data => {
                    let address = data.address;
                    envioDir.value = `${address.road} ${address.house_number}`;
                    envioLocal.value = address.city;
                });
        });
    } else {
        envioDir.value = '';
        envioLocal.value = '';
    }
}

function validoInputsCompra() {

    envioNombre.value = '';
    envioTel.value = '';
    envioNombre.addEventListener('blur', () => {
        document.getElementById('btn_comprar').disabled = true;
        if (envioNombre.value.length >= 5) {
            envioTel.disabled = false;
        } else {
            envioTel.value = '';
            envioTel.disabled = true;
            //envioDir.value = '';
            envioDir.disabled = true;
            //envioLocal.value = '';
            envioLocal.disabled = true;

        }
    });
    envioNombre.addEventListener('keyup', () => {
        document.getElementById('btn_comprar').disabled = true;
        if (envioNombre.value.length >= 5) {
            envioTel.disabled = false;
        } else {
            envioTel.value = '';
            envioTel.disabled = true;
            //envioDir.value = '';
            envioDir.disabled = true;
            //envioLocal.value = '';
            envioLocal.disabled = true;
        }
    });

    envioTel.addEventListener('blur', () => {
        document.getElementById('btn_comprar').disabled = true;
        if (envioTel.value.length >= 8) {
            envioDir.disabled = false;
        } else {
            envioDir.value = '';
            envioDir.disabled = true;
            envioLocal.value = '';
            envioLocal.disabled = true;
        }
    });
    envioTel.addEventListener('keyup', () => {
        document.getElementById('btn_comprar').disabled = true;
        if (envioTel.value.length >= 8) {
            envioDir.disabled = false;
        } else {
            //envioDir.value = '';
            envioDir.disabled = true;
            //envioLocal.value = '';
            envioLocal.disabled = true;
        }
    });

    envioDir.addEventListener('blur', () => {
        document.getElementById('btn_comprar').disabled = true;
        if (envioDir.value.length >= 5) {
            envioLocal.disabled = false;
        } else {
            //envioLocal.value = '';
            envioLocal.disabled = true;
        }
    });
    envioDir.addEventListener('keyup', () => {
        document.getElementById('btn_comprar').disabled = true;
        if (envioDir.value.length >= 5) {
            envioLocal.disabled = false;
        } else {
            //envioLocal.value = '';
            envioLocal.disabled = true;
        }
    });

    envioLocal.addEventListener('blur', () => {
        if (envioLocal.value.length >= 5) {
            document.getElementById('btn_comprar').disabled = false;
        } else {
            document.getElementById('btn_comprar').disabled = true;
        }
    });
    envioLocal.addEventListener('keyup', () => {
        if (envioLocal.value.length >= 5) {
            document.getElementById('btn_comprar').disabled = false;
        } else {
            document.getElementById('btn_comprar').disabled = true;
        }
    });

}

function separadorMiles(num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&.');
}