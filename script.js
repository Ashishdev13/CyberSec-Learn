// Load tips from Local Storage when the page loads
document.addEventListener('DOMContentLoaded', function () {
    const savedTips = JSON.parse(localStorage.getItem('tips')) || [];
    const tipList = document.getElementById('tips');
  
    // Display saved tips
    savedTips.forEach((tip, index) => {
      addTipToDOM(tip.content, tip.pinned, index);
    });
  });
  
  // Handle form submission
  document.getElementById('tipForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from submitting
  
    // Get the tip from the textarea
    const tip = document.getElementById('tip').value;
  
    // Save the tip to Local Storage
    const savedTips = JSON.parse(localStorage.getItem('tips')) || [];
    savedTips.push({ content: tip, pinned: false });
    localStorage.setItem('tips', JSON.stringify(savedTips));
  
    // Add the tip to the DOM
    addTipToDOM(tip, false, savedTips.length - 1);
  
    // Clear the textarea
    document.getElementById('tip').value = '';
  });
  
  // Function to add a tip to the DOM
function addTipToDOM(tip, pinned, index) {
    const tipList = document.getElementById('tips');
  
    // Create a new list item
    const newTip = document.createElement('li');
    newTip.textContent = tip;
  
    // Add pinned class if the tip is pinned
    if (pinned) {
      newTip.classList.add('pinned');
    }
  
    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('buttons');
  
    // Create a remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function () {
      removeTip(index);
    });
  
    // Create a pin/unpin button
    const pinButton = document.createElement('button');
    pinButton.textContent = pinned ? 'Unpin' : 'Pin';
    pinButton.classList.add('pin');
    pinButton.addEventListener('click', function () {
      togglePin(index, pinButton, newTip);
    });
  
    // Append buttons to the container
    buttonContainer.appendChild(pinButton);
    buttonContainer.appendChild(removeButton);
  
    // Append the container to the tip
    newTip.appendChild(buttonContainer);
  
    // Add the tip to the top if pinned, otherwise to the bottom
    if (pinned) {
      tipList.prepend(newTip);
    } else {
      tipList.appendChild(newTip);
    }
  }
  // Function to remove a tip
  function removeTip(index) {
    const savedTips = JSON.parse(localStorage.getItem('tips')) || [];
    savedTips.splice(index, 1); // Remove the tip from the array
    localStorage.setItem('tips', JSON.stringify(savedTips));
  
    // Reload the tips
    document.getElementById('tips').innerHTML = '';
    savedTips.forEach((tip, i) => {
      addTipToDOM(tip.content, tip.pinned, i);
    });
  }
  
  // Function to toggle pin/unpin a tip
  function togglePin(index, pinButton, tipElement) {
    const savedTips = JSON.parse(localStorage.getItem('tips')) || [];
    savedTips[index].pinned = !savedTips[index].pinned; // Toggle pinned status
    localStorage.setItem('tips', JSON.stringify(savedTips));
  
    // Update the button text and tip styling
    pinButton.textContent = savedTips[index].pinned ? 'Unpin' : 'Pin';
    tipElement.classList.toggle('pinned');
  
    // Reload the tips to reorder them
    document.getElementById('tips').innerHTML = '';
    savedTips.forEach((tip, i) => {
      addTipToDOM(tip.content, tip.pinned, i);
    });
  }