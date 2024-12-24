let cart = [];
let currentItem = null;
let quantity = 1;

function scrollToMenu() {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
}
function toggleMenu() {
    const nav = document.querySelector('nav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    nav.classList.toggle('active');
    menuBtn.classList.toggle('active');
  }

  // Close menu when clicking a link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('nav').classList.remove('active');
      document.querySelector('.mobile-menu-btn').classList.remove('active');
    });
  });
function openOrderModal(itemName, price) {
  currentItem = { name: itemName, price: price };
  quantity = 1;
  document.getElementById("modalItemName").textContent = itemName;
  document.getElementById("modalItemPrice").textContent = `$${price}`;
  document.getElementById("quantity").textContent = quantity;
  document.getElementById("orderModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

function updateQuantity(change) {
  quantity = Math.max(1, quantity + change);
  document.getElementById("quantity").textContent = quantity;
}

function addToCart() {
  cart.push({
    ...currentItem,
    quantity: quantity,
  });
  updateCartBadge();
  closeModal();
  showNotification("Added to cart!");
}

function updateCartBadge() {
  document.getElementById("cart-count").textContent = cart.length;
}

function viewCart() {
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  alert(
    `Cart Total: $${total.toFixed(2)}\n\n` +
      cart
        .map(
          (item) =>
            `${item.name} x${item.quantity} - $${(
              item.price * item.quantity
            ).toFixed(2)}`
        )
        .join("\n")
  );
}

function showNotification(message) {
  alert(message); // In a real implementation, this would be a nice toast notification
}

// Close modal when clicking outside
window.onclick = function (event) {
  if (event.target == document.getElementById("orderModal")) {
    closeModal();
  }
};
// Add menu filtering functionality
function filterMenu(category) {
  const items = document.querySelectorAll(".menu-item");
  items.forEach((item) => {
    if (category === "all" || item.dataset.category === category) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// Global styles for the subscription modal
const modalStyles = `
.subscription-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.subscription-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    width: 90%;
    max-width: 500px;
    opacity: 0;
    transition: all 0.3s ease;
}

.subscription-modal.active {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}

.subscription-modal-overlay.active {
    opacity: 1;
}

.subscription-modal h3 {
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    text-align: center;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
}

.subscription-form-group {
    margin-bottom: 1.5rem;
}

.subscription-form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
}

.subscription-form-group input {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.subscription-form-group input:focus {
    outline: none;
    border-color: #4CAF50;
}

.subscription-modal-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.subscription-modal-btn {
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.subscription-modal-btn.primary {
    background: #4CAF50;
    color: white;
}

.subscription-modal-btn.primary:hover {
    background: #45a049;
}

.subscription-modal-btn.secondary {
    background: #f0f0f0;
    color: #333;
}

.subscription-modal-btn.secondary:hover {
    background: #e0e0e0;
}

.subscription-modal .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #999;
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.3s ease;
}

.subscription-modal .close-btn:hover {
    color: #333;
}

.subscription-loading {
    display: none;
    text-align: center;
    padding: 2rem;
}

.subscription-loading .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.subscription-success {
    display: none;
    text-align: center;
    padding: 2rem;
}

.subscription-success i {
    color: #4CAF50;
    font-size: 3rem;
    margin-bottom: 1rem;
}
`;

// Add styles to document
if (!document.getElementById("subscription-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "subscription-styles";
  styleSheet.textContent = modalStyles;
  document.head.appendChild(styleSheet);
}

function subscribe(plan) {
  // Create modal HTML
  const modalHtml = `
        <div class="subscription-modal-overlay">
            <div class="subscription-modal">
                <button class="close-btn" onclick="closeSubscriptionForm()">&times;</button>
                
                <div class="subscription-form">
                    <h3>Subscribe to ${
                      plan.charAt(0).toUpperCase() + plan.slice(1)
                    } Plan</h3>
                    
                    <div class="subscription-form-group">
                        <label for="subName">Full Name</label>
                        <input 
                            type="text" 
                            id="subName" 
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    
                    <div class="subscription-form-group">
                        <label for="subEmail">Email Address</label>
                        <input 
                            type="email" 
                            id="subEmail" 
                            placeholder="Enter your email address"
                            required
                        />
                    </div>
                    
                    <div class="subscription-modal-buttons">
                        <button class="subscription-modal-btn secondary" onclick="closeSubscriptionForm()">
                            Cancel
                        </button>
                        <button class="subscription-modal-btn primary" onclick="submitSubscription('${plan}')">
                            Subscribe Now
                        </button>
                    </div>
                </div>

                <div class="subscription-loading">
                    <div class="spinner"></div>
                    <p>Processing your subscription...</p>
                </div>

                <div class="subscription-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank You!</h3>
                    <p>Your subscription has been confirmed.</p>
                </div>
            </div>
        </div>
    `;

  // Add modal to body
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Animate modal opening
  requestAnimationFrame(() => {
    const overlay = document.querySelector(".subscription-modal-overlay");
    const modal = document.querySelector(".subscription-modal");
    overlay.classList.add("active");
    modal.classList.add("active");
  });
}

function submitSubscription(plan) {
  const name = document.getElementById("subName").value.trim();
  const email = document.getElementById("subEmail").value.trim();

  // Basic validation
  if (!name || !email) {
    alert("Please fill in all fields");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Show loading state
  const formDiv = document.querySelector(".subscription-form");
  const loadingDiv = document.querySelector(".subscription-loading");
  formDiv.style.display = "none";
  loadingDiv.style.display = "block";

  // Simulate API call
  setTimeout(() => {
    // Here you would typically make an API call to your server
    console.log("Subscription submitted:", { name, email, plan });

    // Show success message
    loadingDiv.style.display = "none";
    const successDiv = document.querySelector(".subscription-success");
    successDiv.style.display = "block";

    // Close modal after delay
    setTimeout(closeSubscriptionForm, 2000);
  }, 1500);
}

function closeSubscriptionForm() {
  const overlay = document.querySelector(".subscription-modal-overlay");
  const modal = document.querySelector(".subscription-modal");

  // Animate closing
  overlay.classList.remove("active");
  modal.classList.remove("active");

  // Remove elements after animation
  setTimeout(() => {
    overlay.remove();
  }, 300);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
