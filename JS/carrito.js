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
            const template = document.getElementById("carrito-producto-template");
            const clone = document.importNode(template.content, true);
        
            clone.querySelector(".carrito-producto-imagen").src = producto.imagen;
            clone.querySelector(".carrito-producto-imagen").alt = producto.titulo;
            clone.querySelector(".carrito-producto-titulo h3").textContent = producto.titulo;
            clone.querySelector(".carrito-producto-cantidad p").textContent = producto.cantidad;
            clone.querySelector(".carrito-producto-precio p").textContent = `$${producto.precio}`;
            clone.querySelector(".carrito-producto-subtotal p").textContent = `$${producto.precio * producto.cantidad}`;
        
            const cantidadBtnDisminuir = clone.querySelector(".cantidad-btn-disminuir");
            cantidadBtnDisminuir.setAttribute("data-id", producto.id);
            cantidadBtnDisminuir.addEventListener("click", actualizarCantidad);
        
            const cantidadBtnIncrementar = clone.querySelector(".cantidad-btn-incrementar");
            cantidadBtnIncrementar.setAttribute("data-id", producto.id);
            cantidadBtnIncrementar.addEventListener("click", actualizarCantidad);
        
            clone.querySelector(".carrito-producto-eliminar").id = producto.id;
        
            contenedorCarritoProductos.append(clone);
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
    const template = document.getElementById("carrito-envio-template");
    const clone = document.importNode(template.content, true);
    contenedorCarritoProductos.append(clone);
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