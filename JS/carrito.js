let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

let datosEnvioCompletos = false;

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <div class="cantidad-container">
                        <button class="cantidad-btn" data-action="disminuir" data-id="${producto.id}"><i class="bi bi-dash"></i></button>
                        <p>${producto.cantidad}</p>
                        <button class="cantidad-btn" data-action="incrementar" data-id="${producto.id}"><i class="bi bi-plus"></i></button>
                    </div>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        });

        if (!datosEnvioCompletos) {
            mostrarFormularioEnvio();
        }

        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    const cantidadBtns = document.querySelectorAll(".cantidad-btn");

    cantidadBtns.forEach(btn => {
        btn.addEventListener("click", actualizarCantidad);
    });

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function actualizarCantidad(e) {
    const idProducto = e.currentTarget.getAttribute("data-id");
    const accion = e.currentTarget.getAttribute("data-action");

    const index = productosEnCarrito.findIndex(producto => producto.id === idProducto);

    if (index !== -1) {
        if (accion === "incrementar" && productosEnCarrito[index].cantidad < 5) {
            productosEnCarrito[index].cantidad++;
        } else if (accion === "disminuir" && productosEnCarrito[index].cantidad > 1) {
            productosEnCarrito[index].cantidad--;
        }

        cargarProductosCarrito();
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    }
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);

function mostrarFormularioEnvio() {
    const div1 = document.createElement("div");
    div1.classList.add("carrito-envio");
    div1.innerHTML = `
        <h3>Datos envío</h3>                
        <div class="carrito-envio datos">
            <div>
                <input type="text" id="direccion" placeholder="Dirección" required>
                <input type="text" id="ciudad" placeholder="Ciudad" required>
            </div>
            <div>
                <input type="number" min="0" id="codigo" placeholder="Código postal" required>
                <input type="number" min="0" id="telefono" placeholder="Teléfono" required>
            </div>
        </div>
    `;
    contenedorCarritoProductos.append(div1);
}

function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'warning',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    })
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const codigoPostal = document.getElementById('codigo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    if (direccion === '' || ciudad === '' || codigoPostal === '' || telefono === '') {
        Swal.fire({
            title: 'Campos obligatorios',
            icon: 'error',
            text: 'Por favor, complete todos los campos de envío.',
        });
        return;
    }

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}