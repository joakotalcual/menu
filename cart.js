// cart.js

let cart = [];

// Cargar el carrito desde localStorage si existe
document.addEventListener('DOMContentLoaded', () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartCount();
    }

    // Añadir eventos a los botones "Añadir al carrito"
    window.addEventListener('menuLoaded', () => {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    });

    // Evento para abrir el carrito
    document.getElementById('cart-icon').addEventListener('click', toggleCartModal);
});

// Función para añadir un producto al carrito
function addToCart(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const nombre = button.getAttribute('data-nombre');
    const precio = parseFloat(button.getAttribute('data-precio'));

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        existingProduct.cantidad += 1;
    } else {
        cart.push({ id, nombre, precio, cantidad: 1 });
    }

    updateCartCount();
    saveCart();
    //alert(`${nombre} ha sido añadido al carrito.`);
}

// Función para actualizar el conteo del carrito
function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('cart-count').textContent = count;
}

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para mostrar el modal del carrito
function toggleCartModal() {
    // Crear el modal si no existe
    if (!document.getElementById('cart-modal')) {
        createCartModal();
    }

    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('show');
    renderCart();
}

// Función para crear el modal del carrito
function createCartModal() {
    const modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.classList.add('cart-modal');

    modal.innerHTML = `
        <div class="cart-modal-content">
            <span class="close-button">&times;</span>
            <h2>Tu Carrito</h2>
            <div id="cart-items"></div>
            <div class="cart-subtotal">
                <strong>Subtotal:</strong> $<span id="cart-subtotal">0.00</span>
            </div>
            <button class="checkout-button" disabled>Finalizar Compra</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Eventos para cerrar el modal
    modal.querySelector('.close-button').addEventListener('click', toggleCartModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            toggleCartModal();
        }
    });
}

// Función para renderizar los elementos del carrito en el modal
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        document.getElementById('cart-subtotal').textContent = '0.00';
        return;
    }

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <span>${item.nombre}</span>
            <span>$${item.precio.toFixed(2)} x ${item.cantidad}</span>
            <div class="cart-item-actions">
                <button class="increase-qty" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
                <button class="decrease-qty" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
                <button class="remove-item" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    // Actualizar el subtotal
    const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);

    // Añadir eventos a los botones de acción
    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });

    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Funciones para manejar las acciones en el carrito
function increaseQuantity(event) {
    const id = event.target.getAttribute('data-id');
    const product = cart.find(item => item.id === id);
    if (product) {
        product.cantidad += 1;
        updateCartCount();
        saveCart();
        renderCart();
    }
}

function decreaseQuantity(event) {
    const id = event.target.getAttribute('data-id');
    const product = cart.find(item => item.id === id);
    if (product) {
        if (product.cantidad > 1) {
            product.cantidad -= 1;
        } else {
            // Remover el producto si la cantidad es 1
            cart = cart.filter(item => item.id !== id);
        }
        updateCartCount();
        saveCart();
        renderCart();
    }
}

function removeItem(event) {
    const id = event.target.getAttribute('data-id');
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    saveCart();
    renderCart();
}
