// Inicializa o carrinho ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    initCart();
});

let cart = JSON.parse(localStorage.getItem("meuCarrinho")) || [];

function initCart() {
    // Cria o HTML do ícone e do modal do carrinho
    const cartHTML = `
        <div id="cart-icon" onclick="toggleCart()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span id="cart-count">0</span>
        </div>

        <div class="cart-overlay" id="cart-modal">
            <div class="cart-sidebar">
                <div class="cart-header">
                    <h2>Seu Carrinho</h2>
                    <button class="close-cart" onclick="toggleCart()">×</button>
                </div>
                <div class="cart-items" id="cart-items-container">
                    <p style="text-align:center; margin-top: 20px; color: #999;">Seu carrinho está vazio.</p>
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span id="cart-total-price">R$ 0,00</span>
                    </div>
                    <button class="btn-checkout" onclick="checkoutWhatsApp()">Finalizar Compra</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    updateCartIcon();
}

// Abre/Fecha o carrinho
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        renderCartItems();
        modal.style.display = 'flex';
    }
}

// Adicionar produto
function addToCart(name, price) {
    cart.push({ name, price: parseFloat(price) });
    localStorage.setItem("meuCarrinho", JSON.stringify(cart));
    updateCartIcon();
    toggleCart(); // Abre o carrinho automaticamente
}

// Remover produto
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("meuCarrinho", JSON.stringify(cart));
    renderCartItems();
    updateCartIcon();
}

// Atualiza o contador do ícone
function updateCartIcon() {
    document.getElementById('cart-count').innerText = cart.length;
}

// Renderiza a lista visual
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalElem = document.getElementById('cart-total-price');
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; margin-top: 20px; color: #999;">Seu carrinho está vazio.</p>';
        totalElem.innerText = 'R$ 0,00';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">Remover</button>
            </div>
        `;
    });

    container.innerHTML = html;
    totalElem.innerText = 'R$ ' + total.toFixed(2).replace('.', ',');
}

// Finalizar Compra (Gera Link do WhatsApp)
function checkoutWhatsApp() {
    if (cart.length === 0) return alert("Seu carrinho está vazio!");

    let message = "Olá! Gostaria de finalizar meu pedido no site:\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `• ${item.name} - R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
        total += item.price;
    });

    message += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
    message += "\n\nComo podemos prosseguir com o pagamento e entrega?";

    // SEU NÚMERO DE WHATSAPP AQUI (Apenas números, com código do país 55 e DDD)
    const phone = "5531999999999"; 
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}