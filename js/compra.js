//
moment.locale('es');
let myChart;
//
// Borrar este array
let compraPrueba = [];

let carrito;
traerCarrito(); /* Para ver la cantidad en el icono del carrito en la barra de navegación */

let lista_compras = document.querySelector('#accordionPanelsStayOpenExample');
let compras;
traerCompras();

muestroAnchors();

/* Por defecto que arme la grafica de cantidades del año en el cual estamos */
let anio_funcion = new Date().getFullYear();
graficar(compras, anio_funcion, 'C');

// Cuando cambio el año y/o tipo de gráfico de los selects para mostrar grafica
let sel_anio = document.getElementById('sel_anio');
let sel_grafico = document.getElementById('sel_grafico');
let sel_barraPie = document.getElementById('sel_barraPie');

sel_anio.addEventListener('change', (e) => {
    let anio_sel = sel_anio.value;
    let tipo_sel = sel_grafico.value;

    myChart.destroy();
    graficar(compras, anio_sel, tipo_sel);
});

sel_grafico.addEventListener('change', (e) => {
    let anio_sel = sel_anio.value;
    let tipo_sel = sel_grafico.value;

    myChart.destroy();
    graficar(compras, anio_sel, tipo_sel);

});

///////////////
/* FUNCIONES */
///////////////
function itemCompra(i, compra) {
    let div = '';
    let divItem = '';

    let { id, fecha, juegos } = compra;

    juegos.forEach(j => {
        divItem += `
            <div class="accordion-item accordion-body text-start">
                <div class="d-flex">
                    <img src="${j.imagenes.portada}" alt="Juego ${j.nombre}">
                    <div class="d-flex flex-column justify-content-center">
                        <p class="accordion-item_titulo">Furnace</p>
                        <div class="d-flex flex-column">
                            <p>${j.cantidad} Unidad</p>
                            <p class="accordion-item_precio">$ ${j.precio}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    div = `
        <div class="accordion-item" id="prueba">
            <h2 class="accordion-header" id="panelsStayOpen-heading${nroIngles(i)}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${nroIngles(i)}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${nroIngles(i)}">
                        Accordion Item #1
                    </button>
            </h2>
            ${divItem}
            <div id="panelsStayOpen-collapse${nroIngles(i)}" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading${nroIngles(i)}">                                    
            </div>
        </div>
    `;

    return div;
}

/* FUNCIONES */
function traerCarrito() {

    /* Leo el carrito del localStorage, en caso de no exisitir creo un carro nuevo */
    if (localStorage.getItem('carrito') == null) {
        carrito = new Carrito(1, 'anthony', []);

        localStorage.setItem('carrito', JSON.stringify(carrito));
    } else {
        carrito = JSON.parse(localStorage.getItem('carrito'));
    }

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

function traerCompras() {

    compras = JSON.parse(localStorage.getItem('compras')) || [];

    // Ordeno por fecha descendente las compras
    compras = ordenoCompras(compras, 'D');

    let compras_vacio = document.getElementById('compras_vacio');
    let compras_lleno = document.getElementById('compras_lleno');

    let seccion_grafica = document.getElementById('seccion_grafica');

    if (compras.length == 0) {
        compras_vacio.classList.add('d-block');
        compras_vacio.classList.remove('d-none');

        compras_lleno.classList.add('d-none');
        compras_lleno.classList.remove('d-block');

        seccion_grafica.classList.remove('d-lg-block');

    } else {
        compras_vacio.classList.remove('d-block');
        compras_vacio.classList.add('d-none');

        compras_lleno.classList.remove('d-none');
        compras_lleno.classList.add('d-block');

        seccion_grafica.classList.add('d-lg-block');
    }


    let h_cant_compras = document.getElementById('h_cant_compras');
    let h_monto_total = document.getElementById('h_monto_total');

    h_cant_compras.textContent = `${compras.length}`;
    h_monto_total.textContent = `${separadorMiles(montoTotal(compras))}`;

    lista_compras.innerHTML = '';

    let i = 0;
    compras.forEach(compra => {

        i++;
        itemAcordeon(i, compra);

    });
}

function itemAcordeon(i, compra) {

    let { id, fecha, juegos } = compra;

    let attH = `panelsStayOpen-heading${nroIngles(i)}`;
    let attButton = `#panelsStayOpen-collapse${nroIngles(i)}`;
    let idDiv = `panelsStayOpen-collapse${nroIngles(i)}`;
    let attDiv = `panelsStayOpen-heading${nroIngles(i)}`;

    let div = document.createElement('div');
    let h2 = document.createElement('h2');
    let button = document.createElement('button');
    let div2 = document.createElement('div');

    /* Datos de Envio */
    let divEnvio = document.createElement('div');
    let divEnvioFlex = document.createElement('div');
    let imgEnvio = document.createElement('img');
    let divEnvioHijo = document.createElement('div');
    let pEnvioTitulo = document.createElement('p');
    let pEnvioPrecio = document.createElement('p');

    let montoTotal = juegos.reduce((acc, el) => acc + (el.precio * el.cantidad), 0);

    imgEnvio.setAttribute('src', "../images/delivery.png");
    imgEnvio.setAttribute('alt', 'Img Costos de Envio');

    pEnvioTitulo.classList.add('accordion-item_titulo');
    pEnvioTitulo.textContent = 'Envío';

    pEnvioPrecio.classList.add('accordion-item_precio');
    pEnvioPrecio.textContent = (montoTotal > 10000) ? '$ 0' : '$ 500';

    divEnvioHijo.classList.add('d-flex');
    divEnvioHijo.classList.add('flex-column');
    divEnvioHijo.classList.add('justify-content-center');
    divEnvioHijo.classList.add('mx-4');

    divEnvioHijo.appendChild(pEnvioTitulo);
    divEnvioHijo.appendChild(pEnvioPrecio);

    divEnvioFlex.classList.add('d-flex');
    divEnvioFlex.appendChild(imgEnvio);
    divEnvioFlex.appendChild(divEnvioHijo);


    divEnvio.classList.add('accordion-body');
    divEnvio.classList.add('text-start');
    divEnvio.appendChild(divEnvioFlex);
    /////////////////////////////////////////////////////////////

    div2.setAttribute('id', idDiv);
    div2.setAttribute('aria-labelledby', attDiv);
    div2.classList.add('accordion-collapse');
    div2.classList.add('collapse');
    //div2.classList.add('show');

    juegos.forEach(j => {
        let div3 = document.createElement('div');
        let h5 = document.createElement('h6');
        let divFlex = document.createElement('div');
        let imgJuego = document.createElement('img');
        let divHijo = document.createElement('div');
        let pTitulo = document.createElement('p');
        let divNieto = document.createElement('div');
        let pCantidad = document.createElement('p');
        let pPrecio = document.createElement('p');

        pCantidad.textContent = (j.cantidad > 1) ? `${j.cantidad} Unidades  (Precio Unitario $${separadorMiles(j.precio)})` : `${j.cantidad} Unidad  (Precio Unitario $${separadorMiles(j.precio)})`;
        pPrecio.classList.add('accordion-item_precio');
        pPrecio.textContent = `$ ${separadorMiles(j.precio*j.cantidad)}`;

        divNieto.classList.add('d-flex');
        divNieto.classList.add('flex-column');

        divNieto.appendChild(pCantidad);
        divNieto.appendChild(pPrecio);

        pTitulo.classList.add('accordion-item_titulo');
        pTitulo.textContent = j.nombre;

        divHijo.classList.add('d-flex');
        divHijo.classList.add('flex-column');
        divHijo.classList.add('justify-content-center');
        divHijo.classList.add('mx-4');

        divHijo.appendChild(pTitulo);
        divHijo.appendChild(divNieto);

        imgJuego.setAttribute('src', j.imagenes.portada);
        imgJuego.setAttribute('alt', j.nombre);

        divFlex.classList.add('d-flex');
        divFlex.appendChild(imgJuego);
        divFlex.appendChild(divHijo);

        div3.classList.add('accordion-body');
        div3.classList.add('text-start');

        div3.appendChild(divFlex);
        div3.appendChild(h5);

        div2.appendChild(div3);
        div2.appendChild(divEnvio);
    });

    //div3.textContent = 'Hola, como andas?';        

    button.classList.add('accordion-button');
    button.classList.add('collapsed');
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', attButton);
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-controls', attButton);

    montoTotal = (montoTotal > 10000) ? montoTotal : montoTotal + 500;
    button.textContent = `${id} - ${moment(fecha).format('L')} - Monto $ ${separadorMiles(montoTotal)}`;

    h2.classList.add('accordion-header');
    h2.setAttribute('id', attH);
    h2.appendChild(button);

    div.classList.add('accordion-item');
    div.appendChild(h2);
    div.appendChild(div2);

    lista_compras.appendChild(div);

}

function nroIngles(i) {

    let palabra = numberToWords.toWords(i);
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);

}

function montoTotal(compras) {
    let montoTotal = 0;

    compras.forEach(compra => {
        let montoCompra = compra.juegos.reduce((acc, el) => acc + (el.precio * el.cantidad), 0);
        montoTotal += (montoCompra > 10000) ? montoCompra : (montoCompra + 500);

    });

    return montoTotal;
}

function separadorMiles(num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&.');
}

function ordenoCompras(vector, orden) {

    if (orden == 'D') {
        return vector.sort((a, b) => {
            if (a.fecha > b.fecha) { return -1; }
            if (a.fecha < b.fecha) { return 1; }
            return 0;
        });
    } else {
        return vector.sort((a, b) => {
            if (a.fecha < b.fecha) { return -1; }
            if (a.fecha > b.fecha) { return 1; }
            return 0;
        });
    }


}



function graficar(vector, anio_graf, graf) {

    switch (graf) {
        case "M": // Montos
            pintoGraficaMontos(vector, anio_graf);
            break;
        case "C": // Cantidades
            pintoGraficaCantidad(vector, anio_graf);
            break;
        default:
            break;
    }

}

function pintoGraficaCantidad(compras, anio) {
    let nvo = [];
    compras.forEach(c => {

        let monto = c.juegos.reduce((acc, el) => acc + (el.precio * el.cantidad), 0);
        let totalCompra = (monto < 10000) ? monto + 500 : monto;

        let ob = {
            fecha: c.fecha,
            cantidad: 1, //c.juegos.length,
            monto: totalCompra,
        }
        nvo.push(ob);
    });

    let arrayGrafica = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
        { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }
    ];

    nvo.forEach(n => {
        let anio_compra = new Date(n.fecha).getFullYear();
        let mes = new Date(n.fecha).getMonth();

        if (anio_compra == anio) {
            arrayGrafica[mes].x = mes;
            arrayGrafica[mes].y += n.cantidad;
        }

    });

    armoGrafica(arrayGrafica, anio, 'C');

}

function pintoGraficaMontos(compras, anio) {
    let nvo = [];
    compras.forEach(c => {

        let monto = c.juegos.reduce((acc, el) => acc + (el.precio * el.cantidad), 0);
        let totalCompra = (monto < 10000) ? monto + 500 : monto;

        let ob = {
            fecha: c.fecha,
            cantidad: c.juegos.length,
            monto: totalCompra,
        }
        nvo.push(ob);
    });

    let arrayGrafica = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
        { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }
    ];

    nvo.forEach(n => {
        let anio_compra = new Date(n.fecha).getFullYear();
        let mes = new Date(n.fecha).getMonth();

        if (anio_compra == anio) {
            arrayGrafica[mes].x = mes;
            arrayGrafica[mes].y += n.monto;
        }

    });

    armoGrafica(arrayGrafica, anio, 'M');

}

function armoGrafica(array, anio, grafSeleccionada) {

    let ctx = document.getElementById('myChart').getContext('2d');

    let labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let datos = array;

    let labelGraf = (grafSeleccionada == 'C') ? `Compras Año ${anio}` : `Montos/Mes Año ${anio}`;

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: labelGraf,
                data: datos,
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}

function muestroAnchors() {
    let historial_h = document.getElementById('historial_h');
    let estad_h = document.getElementById('estad_h');
    let sep_h = document.getElementById('sep_h');

    historial_h.style.fontSize = "1.6rem";
    historial_h.style.padding = "10px";
    historial_h.style.borderRadius = "15px";

    sep_h.style.padding = "6px";

    estad_h.style.fontSize = "1.6rem";
    estad_h.style.padding = "10px";
    estad_h.style.borderRadius = "15px";

    historial_h.addEventListener('mouseout', () => {
        historial_h.style.backgroundColor = "transparent";
        historial_h.style.color = "black";
    });

    historial_h.addEventListener('mouseover', () => {
        historial_h.style.backgroundColor = "black";
        historial_h.style.color = "white";
        historial_h.style.transition = "all 500ms ease";
    });

    estad_h.addEventListener('mouseout', () => {
        estad_h.style.backgroundColor = "transparent";
        estad_h.style.color = "black";
    });

    estad_h.addEventListener('mouseover', () => {
        estad_h.style.backgroundColor = "black";
        estad_h.style.color = "white";
        estad_h.style.transition = "all 500ms ease";
    });
}