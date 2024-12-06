// Selectors
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartModal = document.querySelector('#cart-modal');
const cartItemsContainer = document.querySelector('.cart-items');
const cartIcon = document.querySelector('.cart-icon a');
const closeCartButton = document.querySelector('.close-cart');

// Retrieve cart from localStorage or initialize as empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
  cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Render cart items in the modal
function renderCartItems() {
  cartItemsContainer.innerHTML = ''; 
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty!</p>';
  } else {
    cart.forEach((item, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <div class="cart-item">
          <span>${item.name} </span>
          <span>${item.price}</span>
         
          <div class="cart-item-buttons">
             <button class="decrement-item" data-index="${index}">-</button>
                <button class="quantity-item">  ${item.quantity}</button>
            <button class="increment-item" data-index="${index}">+</button><br>
              <button class="place-order" data-index="${index}"> Order Place</button>
                <button class="remove-item" data-index="${index}">Remove card</button>
         
          
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(listItem);

 const placeOrderButton = listItem.querySelector('.place-order');
 placeOrderButton.addEventListener('click', (e) => {
   const itemIndex = e.target.getAttribute('data-index');
   placeOrder(itemIndex); 
 });
});
}
}
function placeOrder(index) {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  
  // Check if user is logged in
  if (!storedUser) {
    Swal.fire({
      title: 'Not Logged In',
      text: 'Please log in to place an order.',
      icon: 'warning',
      confirmButtonText: 'Log In'
    }).then(() => {
      document.getElementById('formContainer').scrollIntoView({ behavior: 'smooth' });
    });
    return; // Exit the function if not logged in
  }

  const item = cart[index];

  if (item.quantity > 0) {
    // Show confirmation alert before placing the order
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to place the order for ${item.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, place order!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulate order placement by reducing the quantity
        item.quantity--; // Decrease the quantity after placing the order

        // Remove the item from the cart if quantity is zero
        if (item.quantity === 0) {
          cart.splice(index, 1); // Remove the item from the cart array
        }

        Swal.fire(
          'Order Placed!',
          `Your order for ${item.name} has been placed successfully.`,
          'success'
        );

        // Re-render the cart items to reflect the updated cart
        renderCartItems();
      }
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `You can't place an order for ${item.name} as the quantity is zero.`,
    });
  }
}




addToCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Directly add item to the cart without login check
    const productItem = button.closest('.product-item');
    const productName = productItem.querySelector('h3').textContent;
    const productPrice = productItem.querySelector('p').textContent;

    // Check if the item is already in the cart
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
      existingItem.quantity += 1; 
    } else {
      cart.push({ name: productName, price: productPrice, quantity: 1 }); 
    }

    saveCart();       // Save the updated cart to storage
    updateCartCount(); // Update the cart count display
    renderCartItems(); // Update the cart items in the UI
    Swal.fire('Success', 'Item added to cart!', 'success');
  });
});


// Open cart modal
cartIcon.addEventListener('click', () => {
  cartModal.classList.add('show');
});

// Close cart modal
closeCartButton.addEventListener('click', () => {
  cartModal.classList.remove('show');
});

// Remove item from cart
cartItemsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCartItems();
  }
});

// Decrement item quantity (by 1)
cartItemsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('decrement-item')) {
    const index = e.target.dataset.index;
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1; 
      saveCart();
      updateCartCount();
      renderCartItems();
    }
  }
});

// Increment item quantity (by 1)
cartItemsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('increment-item')) {
    const index = e.target.dataset.index;
    const item = cart[index];
    item.quantity += 1; 
    saveCart(); 
    updateCartCount();
    renderCartItems();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCartItems();
});







// toggle

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
});



// login Form
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const toSignup = document.getElementById('toSignup');
const toLogin = document.getElementById('toLogin');

// Show signup form when 'Don't have an account?' is clicked
toSignup.addEventListener('click', () => {
  loginForm.classList.add('formhidden');
  signupForm.classList.remove('formhidden');
  signupForm.reset();
  clearErrors(); 
});

// Show login form when 'Already have an account?' is clicked
toLogin.addEventListener('click', () => {
  signupForm.classList.add('formhidden');
  loginForm.classList.remove('formhidden');
  loginForm.reset(); 
  clearErrors(); 
});

// Function to clear previous error messages
function clearErrors() {
  const errorElements = document.querySelectorAll('.error');
  errorElements.forEach(element => element.textContent = '');
}

// Signup form submission
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get the signup form values
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  // Clear previous error messages
  clearErrors();

  let valid = true;

  // Check if fields are empty
  if (!name || !email || !password) {
    valid = false;
    if (!name) document.getElementById('nameError').textContent = 'Name is required';
    if (!email) document.getElementById('emailError').textContent = 'Email is required';
    if (!password) document.getElementById('passwordError').textContent = 'Password is required';
  }

  // Password validation (at least one capital letter, one special character, and 8 characters)
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (password && !passwordRegex.test(password)) {
    valid = false;
    document.getElementById('passwordError').textContent = 'Password must be at least 8 characters, contain one capital letter and one special character';
  }

  if (valid) {
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify({ name, email, password }));
    // SweetAlert for successful signup
    Swal.fire({
      title: 'Success!',
      text: 'Signed up successfully!',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    
    // Clear form fields and switch to login form
    signupForm.reset();
    signupForm.classList.add('formhidden');
    loginForm.classList.remove('formhidden');
  }
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get the login form values
  const loginEmail = document.getElementById('loginEmail').value;
  const loginPassword = document.getElementById('loginPassword').value;
  
  // Clear previous error messages
  clearErrors();
  
  let valid = true;

  // Check if fields are empty
  if (!loginEmail || !loginPassword) {
    valid = false;
    if (!loginEmail) document.getElementById('loginEmailError').textContent = 'Email is required';
    if (!loginPassword) document.getElementById('loginPasswordError').textContent = 'Password is required';
  }

  if (valid) {
    // Retrieve stored user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (storedUser && storedUser.email === loginEmail && storedUser.password === loginPassword) {
      // SweetAlert for successful login
      Swal.fire({
        title: 'Welcome!',
        text: 'Logged in successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      // SweetAlert for invalid credentials
      Swal.fire({
        title: 'Error!',
        text: 'Invalid email or password give signup',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
      document.getElementById('loginPasswordError').textContent = 'Invalid email or password';
    }

    // Clear login form fields
    loginForm.reset();  
  }
});
// profile

const profileLink = document.getElementById('profileLink');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const logoutBtn = document.getElementById('logoutBtn');

// Open profile modal when profile link is clicked
profileLink.addEventListener('click', (e) => {
  e.preventDefault();
  
  // Retrieve user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));
  
  if (storedUser) {
    profileName.textContent = storedUser.name;
    profileEmail.textContent = storedUser.email;
    profileModal.style.display = 'flex';
  } else {
    Swal.fire({
      title: 'Error!',
      text: 'No user is logged in',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
});

// Close the modal
closeProfileModal.addEventListener('click', () => {
  profileModal.style.display = 'none';
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
  // Clear user data from localStorage
  localStorage.removeItem('user');
  
  // Close the modal and show a success message
  profileModal.style.display = 'none';
  Swal.fire({
    title: 'Logged Out',
    text: 'You have been logged out successfully!',
    icon: 'success',
    confirmButtonText: 'OK'
  });
});

// Close modal when clicking outside modal content
window.addEventListener('click', (event) => {
  if (event.target === profileModal) {
    profileModal.style.display = 'none';
  }
});
