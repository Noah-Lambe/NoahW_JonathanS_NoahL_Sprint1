// Author: Noah Lambe
// Date: October 28, 2024
// Description: Script for address form functionality

// Wait for the entire DOM content to be loaded before executing the code
window.addEventListener("DOMContentLoaded", function () {
  // Select various elements needed for form interaction and UI changes
  const formPopup = document.querySelector("#popupForm");
  const openFormBtn = document.querySelector("#openFormBtn");
  const closeFormBtn = document.querySelector("#exit");
  const clearFormBtn = document.querySelector("#clearFormBtn");
  const provinceSelect = document.querySelector("#state");
  const otherProvinceInput = document.querySelector("#otherProvince");

  // Event listener for when the province dropdown selection changes
  provinceSelect.addEventListener("change", function () {
    // Show the "Other" input field if the selected option is "Other"
    if (provinceSelect.value === "Other") {
      otherProvinceInput.style.display = "block";
    } else {
      // Hide and reset the "Other" input field if any other option is selected
      otherProvinceInput.style.display = "none";
      otherProvinceInput.value = "";
    }
  });

  // Event listener to open the form popup when the button is clicked
  openFormBtn.addEventListener("click", function () {
    formPopup.classList.add("active");
  });

  // Event listener to close the form popup when the close button is clicked
  closeFormBtn.addEventListener("click", function () {
    formPopup.classList.remove("active");
  });

  // Event listener to clear all form fields when the clear button is clicked
  clearFormBtn.addEventListener("click", function () {
    let shippingAddress = new ShippingAddress();
    shippingAddress.clearFields();
  });

  // Class representing a shipping address and related methods
  class ShippingAddress {
    constructor(
      fullName,
      phoneNumber,
      country,
      address,
      unit,
      city,
      state,
      postalCode
    ) {
      // Generate a unique ID using the current timestamp
      this.id = Date.now();
      this.fullName = fullName;
      this.phoneNumber = phoneNumber;
      this.country = country;
      this.address = address;
      this.unit = unit;
      this.city = city;
      this.state = state;
      this.postalCode = postalCode;
    }

    // Method to add a shipping address to the list in the DOM
    addShippingAddressToList(shippingAddress) {
      // Check if all required fields are filled out
      if (
        shippingAddress.fullName === "" ||
        shippingAddress.phoneNumber === "" ||
        shippingAddress.country === "" ||
        shippingAddress.address === "" ||
        shippingAddress.city === "" ||
        shippingAddress.state === "" ||
        shippingAddress.postalCode === ""
      ) {
        // Show an alert if any field is missing
        this.showAlert("Please fill in all fields with valid data", "error");
      } else {
        // Create a new table row for the shipping address
        let tr = document.createElement("tr");
        tr.setAttribute("data-address", shippingAddress.id);
        tr.classList.add("shipping-address");
        tr.innerHTML = `
          <td>
            ${shippingAddress.fullName}<br>
            ${shippingAddress.address} ${
          shippingAddress.unit ? ", " + shippingAddress.unit : ""
        }<br>
            ${shippingAddress.city}, ${shippingAddress.state}, ${
          shippingAddress.postalCode
        }<br>
            ${shippingAddress.country}<br>
            Phone: ${shippingAddress.phoneNumber}<br>
            <button class="delete delete-btn">Remove</button>
          </td>`;

        // Append the new row to the address list table
        document.querySelector("#addressList").appendChild(tr);
        // Clear the form fields after adding the address
        this.clearFields();
      }
    }

    // Method to clear all input fields in the form
    clearFields() {
      document.querySelector("#name").value = "";
      document.querySelector("#phone").value = "";
      document.querySelector("#country").value = "Select";
      document.querySelector("#address").value = "";
      document.querySelector("#unit").value = "";
      document.querySelector("#city").value = "";
      document.querySelector("#state").value = "Select";
      document.querySelector("#postal").value = "";
      document.querySelector("#otherProvince").value = "";
      document.querySelector("#otherProvince").style.display = "none";
    }

    // Method to display an alert message in the DOM
    showAlert(message, className) {
      let alert = document.createElement("div");
      alert.className = className.toLowerCase(); // Add a class for styling (e.g., "success" or "error")
      alert.innerText = message;
      alert.id = "box"; // Unique ID for easy removal
      document.querySelector("#alerts").appendChild(alert);

      // Remove the alert after 3 seconds
      setTimeout(() => {
        document.querySelector("#box").remove();
      }, 3000);
    }
  }

  // Class representing storage-related methods for shipping addresses
  class Store {
    // Add a new shipping address to local storage
    static addShippingAddress(shippingAddress) {
      let addresses = Store.getAddresses();
      addresses.push(shippingAddress);
      localStorage.setItem("addresses", JSON.stringify(addresses));
    }

    // Retrieve all stored addresses from local storage
    static getAddresses() {
      let addresses = localStorage.getItem("addresses");
      return addresses ? JSON.parse(addresses) : []; // Return an empty array if no addresses are found
    }

    // Display all stored addresses in the DOM
    static displayAddresses() {
      const addresses = Store.getAddresses();
      addresses.forEach((savedAddress) => {
        let addressObject = new ShippingAddress(
          savedAddress.fullName,
          savedAddress.phoneNumber,
          savedAddress.country,
          savedAddress.address,
          savedAddress.unit,
          savedAddress.city,
          savedAddress.state,
          savedAddress.postalCode
        );
        addressObject.id = savedAddress.id; // Ensure the ID is preserved
        addressObject.addShippingAddressToList(addressObject);
      });
    }

    // Remove an address from local storage by ID
    static removeAddress(id) {
      let addresses = Store.getAddresses();
      addresses = addresses.filter((address) => address.id !== parseInt(id));
      localStorage.setItem("addresses", JSON.stringify(addresses));
    }
  }

  // Event listener for form submission to add a new address
  let form = document.querySelector("#form1");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect form input values
    const fullName = document.querySelector("#name").value;
    const phoneNumber = document.querySelector("#phone").value;
    const country = document.querySelector("#country").value;
    const address = document.querySelector("#address").value;
    const unit = document.querySelector("#unit").value;
    const city = document.querySelector("#city").value;
    const postalCode = document.querySelector("#postal").value;
    const state =
      provinceSelect.value === "Other" && otherProvinceInput.value !== ""
        ? otherProvinceInput.value
        : provinceSelect.value; // Use the "Other" input value if applicable

    // Create a new ShippingAddress object
    let shippingAddress = new ShippingAddress(
      fullName,
      phoneNumber,
      country,
      address,
      unit,
      city,
      state,
      postalCode
    );

    // Add the new address to local storage and display it in the DOM
    Store.addShippingAddress(shippingAddress);
    shippingAddress.addShippingAddressToList(shippingAddress);
    shippingAddress.showAlert("Address added successfully", "success");

    // Close the form popup after submission
    formPopup.classList.remove("active");
  });

  // Event listener for removing addresses from the list and local storage
  document
    .querySelector("#addressList")
    .addEventListener("click", function (event) {
      // Check if the clicked element is a delete button
      if (event.target.classList.contains("delete")) {
        const addressRow = event.target.closest("tr");
        const addressId = addressRow.getAttribute("data-address");

        // Remove the address row from the DOM
        addressRow.remove();
        // Remove the address from local storage
        Store.removeAddress(addressId);

        // Show a success alert for deletion
        let tempAlert = new ShippingAddress();
        tempAlert.showAlert("Address deleted successfully", "success");
      }
      event.preventDefault(); // Prevent default action for the button
    });

  // Display all previously stored addresses on page load
  Store.displayAddresses();
});
