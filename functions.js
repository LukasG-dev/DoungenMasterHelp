"use strict";

/**
 * Fügt einen neuen Eintrag (Charakter/NPC) in den übergebenen Container ein.
 * Der Container muss über die data-Attribute "data-type" (z. B. "Charakter" oder "NPC")
 * und "data-counter" (Anfangszähler, z. B. "2") verfügen.
 */
function createDeleteButton(parentElement) {
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-button';
  deleteBtn.textContent = '-';
  deleteBtn.addEventListener('click', function () {
    parentElement.remove();
  });
  return deleteBtn;
}

function addNewEntry(container) {
  const type = container.dataset.type;
  let count = parseInt(container.dataset.counter, 10) || 0;
  count++;
  container.dataset.counter = count;

  const newElement = document.createElement('div');
  newElement.className = 'character';

  const header = document.createElement('h3');
  header.textContent = `${type} ${count}`;
  newElement.appendChild(header);

  const para = document.createElement('p');
  para.textContent = `Neue spannende Informationen zu ${type} ${count}.`;
  newElement.appendChild(para);

  // Statt doppeltem Code:
  newElement.appendChild(createDeleteButton(newElement));
  newElement.appendChild(createEditButton(newElement));


  const addButton = container.querySelector('.add-button');
  container.insertBefore(newElement, addButton);
}


// Event Listener für beide Buttons
document.getElementById('add-character-btn').addEventListener('click', function() {
  const container = document.getElementById('character-container');
  addNewEntry(container);
});

document.getElementById('add-npc-btn').addEventListener('click', function() {
  const container = document.getElementById('npc-container');
  addNewEntry(container);
});

// Entferne einen Charakter aus dem Charakter oder dem Npc container.
/**
 * Fügt allen bestehenden Charakteren/NPCs einen Löschbutton hinzu.
 */
function initializeActionButtons(container) {
  const entries = container.querySelectorAll('.character');
  entries.forEach(entry => {
    if (!entry.querySelector('.delete-button')) {
      entry.appendChild(createDeleteButton(entry));
    }
    if (!entry.querySelector('.edit-button')) {
      entry.appendChild(createEditButton(entry));
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initializeActionButtons(document.getElementById('character-container'));
  initializeActionButtons(document.getElementById('npc-container'));
});


document.addEventListener('DOMContentLoaded', function () {
  initializeDeleteButtons(document.getElementById('character-container'));
  initializeDeleteButtons(document.getElementById('npc-container'));
});

// charaktere bearbeiten
function createEditButton(parentElement) {
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-button';
  editBtn.textContent = 'Bearbeiten';

  editBtn.addEventListener('click', function () {
    const isEditing = parentElement.classList.toggle('editing');
    const h3 = parentElement.querySelector('h3');
    const p = parentElement.querySelector('p');

    if (isEditing) {
      // Wechsle zu Edit-Modus
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = h3.textContent;
      nameInput.className = 'edit-input';

      const descInput = document.createElement('textarea');
      descInput.value = p.textContent;
      descInput.className = 'edit-textarea';

      h3.replaceWith(nameInput);
      p.replaceWith(descInput);

      editBtn.textContent = 'Speichern';
    } else {
      // Speichern und zurückwechseln
      const nameInput = parentElement.querySelector('input.edit-input');
      const descInput = parentElement.querySelector('textarea.edit-textarea');

      const newH3 = document.createElement('h3');
      newH3.textContent = nameInput.value;

      const newP = document.createElement('p');
      newP.textContent = descInput.value;

      nameInput.replaceWith(newH3);
      descInput.replaceWith(newP);

      editBtn.textContent = 'Bearbeiten';
    }
  });

  return editBtn;
}
