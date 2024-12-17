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

        // Recorre cada input del formulario y verifica si está vacío
        inputs.forEach(({ id, errorId, message }) => {
            const inputElement = document.getElementById(id);
            const errorElement = document.getElementById(errorId);

            // Elimina los espacios extra y verifica si está vacío
            if (inputElement.value.trim() === '') {
                allFieldsFilled = false;
                errorElement.textContent = message; // Muestra el mensaje de error
                errorElement.style.color = 'red'; // Aplica estilos de error
                console.warn(`El campo "${id}" está vacío.`);
            } else {
                errorElement.textContent = ''; // Borra el mensaje de error si el campo está completo
            }
        });

        if (!allFieldsFilled) {
            event.preventDefault(); // Evita que el formulario se envíe
            console.log('Por favor, completa todos los campos.');
        } else {
            console.log('Todos los campos están completos. Enviando formulario...');
        }
    });
});

// ------------------------------------------------------------------------------------------------------

// PRODUCTOS DE API MOSTRADOS POR CONSOLA

document.addEventListener('DOMContentLoaded', function() {
    const apiURL = 'https://fakestoreapi.com/products';

    // Llamada a la API para obtener la lista de productos
    fetch(apiURL)
        .then(response => response.json())
        .then(products => {
            console.log('Productos disponibles:');
            
            // Toma los primeros 10 productos
            const limitedProducts = products.slice(0, 10);
            
            limitedProducts.forEach(product => {
                console.log(`ID: ${product.id}`);
                console.log(`Nombre: ${product.title}`);
                console.log(`Precio: $${product.price}`);
                console.log(`Categoría: ${product.category}`);
                console.log('-------------------------');
            });
        })
        .catch(error => console.error('Error al obtener los productos:', error));
});



// ------------------------------------------------------------------------------------------------------

// PRODUCTOS DE API MOSTRADOS EN EL SITIO + CARRITO

document.addEventListener('DOMContentLoaded', function () {
    const apiURL = 'https://fakestoreapi.com/products';
    const contenedorShop = document.querySelector('.contenedor-shop'); // Seleccionamos el contenedor de productos
    let carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Inicializamos carrito desde localStorage

    // Función para renderizar productos en el sitio
    function renderizarProductos() {
        fetch(apiURL)
            .then(response => response.json())
            .then(products => {
                console.log('Generando productos dinámicos...');
                const limitedProducts = products.slice(0, 50);

                limitedProducts.forEach(product => {
                    const productHTML = `
                        <div class="elemento" id="producto-${product.id}">
                            <img class="img-elemento" src="${product.image}" alt="${product.title}" height="300" />
                            <p class="nombre-producto">${product.title}</p>
                            <p class="precio">$${product.price}</p>
                            <button class="btn btn-dark btn-agregar" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">
                                Agregar al carrito
                            </button>
                        </div>
                    `;
                    contenedorShop.innerHTML += productHTML;
                });

                // Agregar eventos a los botones
                document.querySelectorAll('.btn-agregar').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.dataset.id;
                        const title = btn.dataset.title;
                        const price = parseFloat(btn.dataset.price);

                        agregarAlCarrito({ id, title, price });
                    });
                });

                console.log('Productos generados correctamente.');
            })
            .catch(error => console.error('Error al obtener los productos:', error));
    }

    // Función para agregar producto al carrito
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

    // Función para renderizar el carrito
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

    // Función para cambiar la cantidad de un producto
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

    // Función para eliminar producto del carrito
    window.eliminarDelCarrito = (id) => {
        carrito = carrito.filter(producto => producto.id !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();
    };

    // Cargar productos y carrito al iniciar
    renderizarProductos();
    renderCarrito();
});