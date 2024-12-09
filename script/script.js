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

// PRODUCTOS DE API MOSTRADOS EN EL SITIO

document.addEventListener('DOMContentLoaded', function() {
    const apiURL = 'https://fakestoreapi.com/products';
    const contenedorShop = document.querySelector('.contenedor-shop'); // Seleccionamos el contenedor de productos

    // Llamada a la API para obtener la lista de productos
    fetch(apiURL)
        .then(response => response.json())
        .then(products => {
            console.log('Generando productos dinámicos...');

            // Primeros 10 productos de la API
            const limitedProducts = products.slice(0, 10);
            
            limitedProducts.forEach(product => {
                // HTML de cada producto
                const productHTML = `
                    <div class="elemento">
                        <img class="img-elemento" src="${product.image}" alt="${product.title}" height="300" />
                        <p class="nombre-producto">${product.title}</p>
                        <p class="precio">$${product.price}</p>
                    </div>
                `;

                // Insertar el producto en el contenedor
                contenedorShop.innerHTML += productHTML;
            });

            console.log('Productos generados correctamente.');
        })
        .catch(error => console.error('Error al obtener los productos:', error));
});

