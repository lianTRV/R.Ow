// VERIFICACION CAMPOS LLENOS EN FORMULARIO DE CONTACTO

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const inputs = [
        { id: 'nombre', errorId: 'error-nombre', message: 'El campo "Nombre" es obligatorio.' },
        { id: 'email', errorId: 'error-email', message: 'El campo "Email" es obligatorio.' },
        { id: 'mensaje', errorId: 'error-msg', message: 'El campo "Mensaje" es obligatorio.' }
    ];

    form.addEventListener('submit', function(event) {
        let allFieldsFilled = true;

        inputs.forEach(({ id, errorId, message }) => {
            const inputElement = document.getElementById(id);
            const errorElement = document.getElementById(errorId);

            if (inputElement.value.trim() === '') {
                allFieldsFilled = false;
                errorElement.textContent = message;
                errorElement.style.color = 'red';
            } else {
                errorElement.textContent = '';
            }
        });

        if (!allFieldsFilled) {
            event.preventDefault();
        }
    });
});

// ------------------------------------------------------------------------------------------------------

// PRODUCTOS DE API MOSTRADOS POR CONSOLA

document.addEventListener('DOMContentLoaded', function() {
    const apiURL = 'https://fakestoreapi.com/products';

    fetch(apiURL)
        .then(response => response.json())
        .then(products => {
            const limitedProducts = products.slice(0, 10);

            limitedProducts.forEach(product => {
                console.log(`ID: ${product.id}`);
                console.log(`Nombre: ${product.title}`);
                console.log(`Precio: $${product.price}`);
                console.log(`Categoría: ${product.category}`);
            });
        })
        .catch(error => console.error('Error al obtener los productos:', error));
});

// ------------------------------------------------------------------------------------------------------

// PRODUCTOS DE API Y PROPIOS MOSTRADOS EN EL SITIO + CARRITO

document.addEventListener('DOMContentLoaded', function () {
    const apiURL = 'https://fakestoreapi.com/products';
    const contenedorShop = document.querySelector('.contenedor-shop');
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productosPropios = [
        {
            id: 'propio1',
            title: 'JACKET LIDO',
            price: 2000,
            image: '../files/img/hombre/PRODUCTO-5-JACKET-LIDO.jpg',
            description: 'JACKET PRODUCT'
        },
        {
            id: 'propio2',
            title: 'RICK SHOES',
            price: 1800,
            image: '../files/img/hombre/PRODUCTO-17-SHOES.jpg',
            description: 'RICK OWENS SHOES MODEL'
        },
        {
            id: 'propio3',
            title: 'SANDAL',
            price: 600,
            image: '../files/img/hombre/PRODUCTO-13-SANDAL.jpg',
            description: 'RICK OWENS SANDAL'
        }
    ];

    function renderizarProductos() {
        fetch(apiURL)
            .then(response => response.json())
            .then(products => {
                const allProducts = [...products.slice(0, 50), ...productosPropios];

                allProducts.forEach(product => {
                    const productHTML = `
                        <div class="elemento" id="producto-${product.id}">
                            <img class="img-elemento" src="${product.image}" alt="${product.title}" height="300" />
                            <p class="nombre-producto">${product.title}</p>
                            <p class="precio">$${product.price}</p>
                            <button class="btn btn-dark btn-agregar" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">
                                Agregar al carrito
                            </button>
                            <button class="btn btn-info btn-ver-mas" data-id="${product.id}" data-description="${product.description}">
                                Ver más
                            </button>
                        </div>
                    `;
                    contenedorShop.innerHTML += productHTML;
                });

                document.querySelectorAll('.btn-agregar').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.dataset.id;
                        const title = btn.dataset.title;
                        const price = parseFloat(btn.dataset.price);

                        agregarAlCarrito({ id, title, price });
                    });
                });

                document.querySelectorAll('.btn-ver-mas').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const description = btn.dataset.description;
                        alert(`Descripción: ${description}`);
                    });
                });
            })
            .catch(error => console.error('Error al obtener los productos:', error));
    }

    function agregarAlCarrito(producto) {
        const existe = carrito.find(item => item.id === producto.id);

        if (existe) {
            existe.quantity++;
        } else {
            carrito.push({ ...producto, quantity: 1 });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();
    }

    function renderCarrito() {
        const contenedorCarrito = document.getElementById('carrito');
        contenedorCarrito.innerHTML = '';

        carrito.forEach(item => {
            contenedorCarrito.innerHTML += `
                <div class="item-carrito">
                    <h4>${item.title}</h4>
                    <p>Precio: $${item.price}</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <button onclick="cambiarCantidad('${item.id}', 1)">+</button>
                    <button onclick="cambiarCantidad('${item.id}', -1)">-</button>
                    <button onclick="eliminarDelCarrito('${item.id}')">Eliminar</button>
                </div>
            `;
        });
    }

    window.cambiarCantidad = (id, cambio) => {
        const item = carrito.find(producto => producto.id === id);

        if (item) {
            item.quantity += cambio;
            if (item.quantity <= 0) {
                carrito = carrito.filter(producto => producto.id !== id);
            }
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderCarrito();
        }
    };

    window.eliminarDelCarrito = (id) => {
        carrito = carrito.filter(producto => producto.id !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();
    };

    renderizarProductos();
    renderCarrito();
});
