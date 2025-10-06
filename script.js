// Flower products data
const products = [
    {
        id: 1,
        name: "Red Roses",
        description: "Classic red roses, perfect for expressing love and romance.",
        price: 49.99,
        emoji: "🌹"
    },
    {
        id: 2,
        name: "Sunflowers",
        description: "Bright and cheerful sunflowers to brighten any day.",
        price: 35.99,
        emoji: "🌻"
    },
    {
        id: 3,
        name: "Tulips",
        description: "Elegant tulips in vibrant colors for any occasion.",
        price: 39.99,
        emoji: "🌷"
    },
    {
        id: 4,
        name: "Orchids",
        description: "Exotic orchids that bring elegance to any space.",
        price: 59.99,
        emoji: "🌺"
    },
    {
        id: 5,
        name: "Daisies",
        description: "Fresh daisies symbolizing innocence and purity.",
        price: 29.99,
        emoji: "🌼"
    },
    {
        id: 6,
        name: "Lilies",
        description: "Beautiful lilies with a delightful fragrance.",
        price: 44.99,
        emoji: "🌸"
    },
    {
        id: 7,
        name: "Cherry Blossoms",
        description: "Delicate cherry blossoms for a touch of spring.",
        price: 54.99,
        emoji: "🌸"
    },
    {
        id: 8,
        name: "Hibiscus",
        description: "Tropical hibiscus flowers in stunning colors.",
        price: 42.99,
        emoji: "🌺"
    },
    {
        id: 9,
        name: "Lavender Bouquet",
        description: "Fragrant lavender bouquet for relaxation and calm.",
        price: 37.99,
        emoji: "💐"
    }
];

// Shopping cart
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    updateCartDisplay();
    
    // Contact form submission
    document.getElementById('contact-form').addEventListener('submit', handleContactForm);
});

// Load products into the grid
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    
    // Show a brief confirmation
    showNotification(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateCartModal();
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart modal content
function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
    } else {
        modal.classList.add('active');
        updateCartModal();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        modal.classList.remove('active');
    }
}

// Clear cart
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        updateCartModal();
        showNotification('Cart cleared!');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(`Thank you for your order!\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}\n\nWe will contact you shortly to confirm your delivery details.`);
    
    cart = [];
    saveCart();
    updateCartDisplay();
    toggleCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('flowerShopCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('flowerShopCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // In a real application, this would send the data to a server
    console.log('Contact form submitted:', { name, email, message });
    
    alert(`Thank you for contacting us, ${name}!\n\nWe have received your message and will get back to you at ${email} shortly.`);
    
    // Clear form
    document.getElementById('contact-form').reset();
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
