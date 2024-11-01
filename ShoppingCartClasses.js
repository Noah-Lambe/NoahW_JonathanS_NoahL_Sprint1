// Author: Noah Lambe
// Dates: October 21, 2024 - October 31, 2024
// Description: Script for storing and displaying cart item functionality

// Wait for the entire DOM content to load before executing the code
window.addEventListener("DOMContentLoaded", function () {
  // Class representing a product with basic properties
  class Product {
    constructor(id, name, price, imgUrl) {
      this.id = id; // Unique identifier for the product
      this.name = name; // Name of the product
      this.price = price; // Price of the product
      this.imgUrl = imgUrl; // Image URL of the product
    }
  }

  // Class representing an item in the shopping cart, extending the Product class
  class CartItem extends Product {
    constructor(id, name, price, imgUrl, quantity = 1) {
      super(id, name, price, imgUrl); // Call the parent constructor to initialize properties
      this.quantity = quantity; // Quantity of the product in the cart
    }

    // Method to increase the quantity of the item
    increaseQuantity() {
      this.quantity += 1;
    }

    // Method to calculate the total price for the item based on its quantity
    getTotalPrice() {
      return this.price * this.quantity;
    }
  }

  // Class representing the shopping cart and its operations
  class ShoppingCart {
    constructor() {
      this.cart = this.loadCart(); // Load the cart from local storage when initialized
    }

    // Load cart data from local storage, or return an empty array if none exists
    loadCart() {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      // Convert each saved item into a CartItem object
      return savedCart.map(
        (item) =>
          new CartItem(
            item.id,
            item.name,
            item.price,
            item.imgUrl,
            item.quantity
          )
      );
    }

    // Save the current cart to local storage
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    }

    // Add a product to the cart; increase quantity if it already exists
    addItem(product) {
      const existingItem = this.cart.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.increaseQuantity(); // Increment the quantity if the item already exists
      } else {
        // Create a new CartItem object and add it to the cart
        const newItem = new CartItem(
          product.id,
          product.name,
          product.price,
          product.imgUrl
        );
        this.cart.push(newItem);
      }
      this.saveCart(); // Save updated cart to local storage
    }

    // Remove an item from the cart by its ID
    removeItem(id) {
      this.cart = this.cart.filter((item) => item.id !== id);
      this.saveCart(); // Save updated cart to local storage
    }

    // Retrieve all items in the cart
    getCartItems() {
      return this.cart;
    }

    // Calculate the total price of all items in the cart
    getTotal() {
      return this.cart.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    // Clear all items from the cart
    clearCart() {
      this.cart = [];
      this.saveCart(); // Save updated cart to local storage
    }
  }

  // Instantiate a new shopping cart object
  const cart = new ShoppingCart();

  // Add event listeners to all "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      // Get product details from the data attributes of the button
      const id = this.dataset.id;
      const name = this.dataset.name;
      const price = parseFloat(this.dataset.price);
      const imgUrl = this.dataset.imgUrl; // Retrieve the image URL from the data attribute

      // Create a new Product object and add it to the cart
      const product = new Product(id, name, price, imgUrl);
      cart.addItem(product);

      // Show an alert message confirming the addition
      alert(`${name} added to cart!`);
    });
  });

  // Function to display cart items and the total in the UI
  function displayCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    const totalDiv = document.getElementById("total");

    // Clear existing cart display content
    cartItemsDiv.innerHTML = "";

    const cartItems = cart.getCartItems(); // Get current cart items

    if (cartItems.length === 0) {
      // Display a message if the cart is empty
      cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
      totalDiv.textContent = "Total: $0.00";
    } else {
      // Iterate over each cart item and create an HTML element to display it
      cartItems.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
          <img src="${item.imgUrl}" alt="${
          item.name
        }" class="cart-item-image" />
          <p>${item.name} - $${item.price.toFixed(2)} x ${
          item.quantity
        } = $${item.getTotalPrice().toFixed(2)}</p>
        `;

        // Create a "Remove" button and add an event listener to remove the item from the cart
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-item-button");
        removeButton.addEventListener("click", () => {
          cart.removeItem(item.id); // Remove the item by its ID
          displayCart(); // Refresh the cart display
        });

        // Append the remove button to the item div and the item div to the cart display
        itemDiv.appendChild(removeButton);
        cartItemsDiv.appendChild(itemDiv);
      });

      // Update the total price display
      totalDiv.textContent = `Total: $${cart.getTotal().toFixed(2)}`;
    }
  }

  // Automatically display the cart if the current page is Cart.html
  if (window.location.pathname.includes("Cart.html")) {
    displayCart();
  }
});
