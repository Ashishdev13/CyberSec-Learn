import { supabase } from './supabase.js';

// Load tips from Supabase when the page loads
document.addEventListener('DOMContentLoaded', async function () {
  const tipList = document.getElementById('tips');

  try {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .order('pinned', { ascending: false }); // Show pinned tips first

    if (error) throw error;

    data.forEach((tip) => {
      addTipToDOM(tip.content, tip.pinned, tip.id);
    });
  } catch (error) {
    console.error('Failed to load tips:', error);
  }
});

// Handle form submission
document.getElementById('tipForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent form from submitting

  // Get the tip from the textarea
  const tip = document.getElementById('tip').value;

  try {
    // Save the tip to Supabase
    const { data, error } = await supabase
      .from('tips')
      .insert([{ content: tip, pinned: false }]);

    if (error) throw error;

    // Add the tip to the DOM
    addTipToDOM(tip, false, data[0].id);

    // Clear the textarea
    document.getElementById('tip').value = '';
  } catch (error) {
    console.error('Failed to save tip:', error);
  }
});

// Function to add a tip to the DOM
function addTipToDOM(tip, pinned, id) {
  const tipList = document.getElementById('tips');

  // Create a new list item
  const newTip = document.createElement('li');
  newTip.textContent = tip;
  newTip.setAttribute('data-id', id); // Add a data-id attribute

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
  removeButton.addEventListener('click', async function () {
    try {
      const { error } = await supabase
        .from('tips')
        .delete()
        .eq('id', id); // Delete the tip from Supabase

      if (error) throw error;

      newTip.remove(); // Remove the tip from the DOM
    } catch (error) {
      console.error('Failed to delete tip:', error);
    }
  });

  // Create a pin/unpin button
  const pinButton = document.createElement('button');
  pinButton.textContent = pinned ? 'Unpin' : 'Pin';
  pinButton.classList.add('pin');
  pinButton.addEventListener('click', async function () {
    try {
      const { error } = await supabase
        .from('tips')
        .update({ pinned: !pinned })
        .eq('id', id); // Toggle pinned status in Supabase

      if (error) throw error;

      pinButton.textContent = pinned ? 'Pin' : 'Unpin'; // Update button text
      newTip.classList.toggle('pinned'); // Update tip styling

      // Move pinned tips to the top
      if (!pinned) {
        tipList.prepend(newTip);
      } else {
        tipList.appendChild(newTip);
      }
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
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

// Subscribe to real-time updates
supabase
  .from('tips') // Listen to the 'tips' table
  .on('*', (payload) => { // Listen to all events (INSERT, UPDATE, DELETE)
    const tipList = document.getElementById('tips');

    if (payload.eventType === 'INSERT') {
      // Add new tip to the DOM
      addTipToDOM(payload.new.content, payload.new.pinned, payload.new.id);
    } else if (payload.eventType === 'DELETE') {
      // Remove tip from the DOM
      const tipToRemove = document.querySelector(`li[data-id="${payload.old.id}"]`);
      if (tipToRemove) tipToRemove.remove();
    } else if (payload.eventType === 'UPDATE') {
      // Update tip in the DOM
      const tipToUpdate = document.querySelector(`li[data-id="${payload.new.id}"]`);
      if (tipToUpdate) {
        tipToUpdate.textContent = payload.new.content;
        tipToUpdate.classList.toggle('pinned', payload.new.pinned);

        // Move pinned tips to the top
        if (payload.new.pinned) {
          tipList.prepend(tipToUpdate);
        } else {
          tipList.appendChild(tipToUpdate);
        }
      }
    }
  })
  .subscribe();
