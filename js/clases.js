class Usuario {
    constructor(id, nombre, apellido, mail) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.mail = mail;
    }
}

class Juego {

    constructor(id, nombre, editor, precio, stock, imagenes, descripcion, componentes) {
        this.id = id;
        this.nombre = nombre.toUpperCase();
        this.editor = editor.toUpperCase();
        this.precio = precio;
        this.stock = stock;
        this.imagenes = imagenes;
        this.descripcion = descripcion;
        this.componentes = componentes;
    }

    detalle() {
        return `
            Detalles del juego ${this.nombre} 
               Editor: ${this.editor}
               Stock Actual: ${this.stock}
               Precio: ${this.precio}
        `;
    }

    iva(porc) {
        return (this.precio * porc / 100);
    }

    vender(cantidad) {

        let stockActual = this.stock;

        if (this.stock == 0) {
            return `No hay stock del juego ${this.nombre}`;

        } else if (this.stock >= cantidad) {

            this.stock -= cantidad;

            return `Se vendieron ${cantidad} unidades del juego`;
        } else if (cantidad > this.stock) {
            this.stock = 0;
            return `Se vendió unicamente ${stockActual} unidades del juego`;
        }
    }
}

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