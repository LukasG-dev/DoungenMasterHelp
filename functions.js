"use strict";

/**
 * Fügt einen neuen Eintrag (Charakter/NPC) in den übergebenen Container ein.
 * Der Container muss über die data-Attribute "data-type" (z. B. "Charakter" oder "NPC")
 * und "data-counter" (Anfangszähler, z. B. "2") verfügen.
 */
function addNewEntry(container) {
  // Character or Npc
  const type = container.dataset.type;
  // Aktuellen Zähler auslesen und in eine Zahl umwandeln
  let count = parseInt(container.dataset.counter, 10) || 0;
  count++; // Zähler erhöhen
  container.dataset.counter = count; // Aktualisieren

  // Neues Element erstellen
  const newElement = document.createElement('div');
  
  newElement.className = 'character';

  // Überschrift erstellen
  const header = document.createElement('h3');
  header.textContent = type + " " + count;
  newElement.appendChild(header);

  // Beschreibung erstellen
  const para = document.createElement('p');
  para.textContent = 'Neue spannende Informationen zu ' + type + " " + count + '.';
  newElement.appendChild(para);

  // Den Plus-Button im Container finden
  const addButton = container.querySelector('.add-button');
  // Den neuen Eintrag vor dem Button einfügen, damit dieser immer am unteren Rand bleibt
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

function deleteEntry(container){
    // character or Npc
    const type = container.dataset.type;
}

