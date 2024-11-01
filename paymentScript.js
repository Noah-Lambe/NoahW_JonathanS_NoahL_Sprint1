// Author: Noah Lambe
// Dates: October 21, 2024 - October 30, 2024
// Description: Script for payment information functionality

// Wait for the entire DOM content to load before executing the code
window.addEventListener("DOMContentLoaded", function () {
  // Select necessary DOM elements for payment form interactions
  const paymentPopup = document.getElementById("paymentPopup");
  const openFormBtn = document.getElementById("openPaymentFormBtn");
  const closeFormBtn = document.getElementById("closePaymentFormBtn");
  const clearFormBtn = document.getElementById("clearPaymentFormBtn");
  const creditCardOption = document.getElementById("creditCardOption");
  const bankTransferOption = document.getElementById("bankTransferOption");
  const creditCardFields = document.getElementById("creditCardFields");
  const bankTransferFields = document.getElementById("bankTransferFields");
  const submitButton = document.querySelector(
    "#paymentForm button[type='submit']"
  );
  const alertBox = document.getElementById("alert");

  // Event listener to open the payment form popup and reset form display
  openFormBtn.addEventListener("click", () => {
    paymentPopup.classList.remove("hidden");
    creditCardFields.style.display = "none";
    bankTransferFields.style.display = "none";
    submitButton.style.display = "none";
    clearFormBtn.style.display = "none";
  });

  // Event listener to close the payment form popup
  closeFormBtn.addEventListener("click", () => {
    paymentPopup.classList.add("hidden");
  });

  // Event listener to clear the form fields when the clear button is clicked
  clearFormBtn.addEventListener("click", () => {
    let paymentInfo = new PaymentInfo();
    paymentInfo.clearFields();
  });

  // Event listener for the credit card option selection
  creditCardOption.addEventListener("change", function () {
    if (creditCardOption.checked) {
      // Show credit card fields and hide bank transfer fields
      creditCardFields.style.display = "block";
      bankTransferFields.style.display = "none";
      submitButton.style.display = "block";
      clearFormBtn.style.display = "block";

      // Set required attributes for relevant credit card input fields
      document.getElementById("cardNumber").required = true;
      document.getElementById("expiryDate").required = true;
      document.getElementById("cvv").required = true;
      document.getElementById("bankName").required = false;
      document.getElementById("accountNumber").required = false;
      document.getElementById("routingNumber").required = false;
    }
  });

  // Event listener for the bank transfer option selection
  bankTransferOption.addEventListener("change", function () {
    if (bankTransferOption.checked) {
      // Show bank transfer fields and hide credit card fields
      creditCardFields.style.display = "none";
      bankTransferFields.style.display = "block";
      submitButton.style.display = "block";
      clearFormBtn.style.display = "block";

      // Set required attributes for relevant bank transfer input fields
      document.getElementById("cardNumber").required = false;
      document.getElementById("expiryDate").required = false;
      document.getElementById("cvv").required = false;
      document.getElementById("bankName").required = true;
      document.getElementById("accountNumber").required = true;
      document.getElementById("routingNumber").required = true;
    }
  });

  // Class representing payment information and related methods
  class PaymentInfo {
    constructor(
      method,
      cardNumber,
      expiryDate,
      cvv,
      bankName,
      accountNumber,
      routingNumber
    ) {
      // Initialize properties for payment information
      this.method = method;
      this.cardNumber = cardNumber || "";
      this.expiryDate = expiryDate || "";
      this.cvv = cvv || "";
      this.bankName = bankName || "";
      this.accountNumber = accountNumber || "";
      this.routingNumber = routingNumber || "";
    }

    // Method to add payment details to the list displayed in the DOM
    addPaymentToList(paymentInfo) {
      const paymentEntry = document.createElement("div");
      paymentEntry.classList.add("payment-card");
      paymentEntry.innerHTML = `
          <div class="payment-method">Payment Method: <strong>${
            this.method
          }</strong></div>
          <div class="payment-details">
            ${
              this.method === "Credit Card"
                ? `
              <p>Card Number: **** **** **** ${this.cardNumber.slice(-4)}</p>
              <p>Expiry Date: ${this.expiryDate}</p>
            `
                : `
              <p>Bank: ${this.bankName}</p>
              <p>Account Number: **** ${this.accountNumber.slice(-4)}</p>
            `
            }
          </div>
          <button class="remove-btn" data-account="${
            this.accountNumber
          }">Remove</button>
        `;
      document.getElementById("paymentList").appendChild(paymentEntry);
      this.clearFields(); // Clear input fields after adding to the list
    }

    // Method to clear all input fields in the payment form
    clearFields() {
      document.getElementById("cardNumber").value = "";
      document.getElementById("expiryDate").value = "";
      document.getElementById("cvv").value = "";
      document.getElementById("bankName").value = "";
      document.getElementById("accountNumber").value = "";
      document.getElementById("routingNumber").value = "";
    }

    // Method to display alert messages
    showAlert(message, className) {
      alertBox.innerText = message;
      alertBox.className = `alert ${className}`; // Add alert type class (e.g., "success" or "error")
      alertBox.classList.remove("hidden");

      // Hide the alert after 3 seconds
      setTimeout(() => {
        alertBox.classList.add("hidden");
        alertBox.innerText = "";
      }, 3000);
    }
  }

  // Class representing storage-related functions for payment information
  class Store {
    // Add a payment entry to local storage
    static addPayment(paymentInfo) {
      const payments = Store.getPayments();
      payments.push(paymentInfo);
      localStorage.setItem("payments", JSON.stringify(payments));
    }

    // Retrieve payment entries from local storage
    static getPayments() {
      return JSON.parse(localStorage.getItem("payments")) || [];
    }

    // Display stored payment information in the DOM
    static displayPaymentInfo() {
      Store.getPayments().forEach((savedPaymentInfo) => {
        new PaymentInfo(
          savedPaymentInfo.method,
          savedPaymentInfo.cardNumber,
          savedPaymentInfo.expiryDate,
          savedPaymentInfo.cvv,
          savedPaymentInfo.bankName,
          savedPaymentInfo.accountNumber,
          savedPaymentInfo.routingNumber
        ).addPaymentToList();
      });
    }

    // Remove a payment entry from local storage and the DOM
    static removePayment(element) {
      const accountNumberToRemove = element.getAttribute("data-account");
      const updatedPayments = Store.getPayments().filter(
        (payment) => payment.accountNumber !== accountNumberToRemove
      );
      localStorage.setItem("payments", JSON.stringify(updatedPayments));
      element.parentElement.parentElement.remove(); // Remove the payment entry element from the DOM
    }
  }

  // Event listener for removing payment entries when the "Remove" button is clicked
  document
    .getElementById("paymentList")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("remove-btn")) {
        Store.removePayment(event.target);
      }
    });

  // Event listener for form submission to add payment information
  document
    .querySelector("#paymentForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Determine which payment method is selected
      const method = creditCardOption.checked ? "Credit Card" : "Bank Transfer";
      const paymentInfo = new PaymentInfo(
        method,
        document.getElementById("cardNumber").value,
        document.getElementById("expiryDate").value,
        document.getElementById("cvv").value,
        document.getElementById("bankName").value,
        document.getElementById("accountNumber").value,
        document.getElementById("routingNumber").value
      );

      // Add the new payment information to local storage and display it
      Store.addPayment(paymentInfo);
      paymentInfo.addPaymentToList();
      paymentInfo.showAlert(
        "Payment information successfully added",
        "success"
      );
    });

  // Display all previously stored payment information when the page loads
  Store.displayPaymentInfo();
});
