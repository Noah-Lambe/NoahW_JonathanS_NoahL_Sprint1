// Author: Noah Whiffen
// Date: October 30, 2024
// Description: Script for side scrolling functionality

// Function to scroll items left within a container
function scrollItemsLeft(button) {
  console.log("Scroll Left Clicked"); // Log message to indicate left scroll action

  // Select the next sibling element of the button (assumed to be the container to scroll)
  const container = button.nextElementSibling;

  if (container) {
    // Scroll the container 300 pixels to the left with a smooth scrolling effect
    container.scrollBy({ left: -300, behavior: "smooth" });
  }
}

// Function to scroll items right within a container
function scrollItemsRight(button) {
  console.log("Scroll Right Clicked"); // Log message to indicate right scroll action

  // Select the previous sibling element of the button (assumed to be the container to scroll)
  const container = button.previousElementSibling;

  if (container) {
    // Scroll the container 300 pixels to the right with a smooth scrolling effect
    container.scrollBy({ left: 300, behavior: "smooth" });
  }
}
