"use strict";

// ============================== Basisfunktionen ==============================

function createDeleteButton(parentElement) {
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-button';
  deleteBtn.textContent = '-';
  deleteBtn.addEventListener('click', () => parentElement.remove());
  return deleteBtn;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================== Charakter & NPC ==============================

function addNewEntry(container) {
  const type = container.dataset.type;
  let count = parseInt(container.dataset.counter, 10) || 0;
  container.dataset.counter = ++count;

  const newElement = document.createElement('div');
  newElement.classList.add('character', 'field');

  const charakter = {
    name: `${type} ${count}`,
    klasse: "Krieger",
    rasse: "Mensch",
    level: 1,
    bewegung: 30,
    ac: 10,
    hp: { aktuell: 12, max: 12 },
    attribute: {
      staerke: 12,
      geschicklichkeit: 10,
      konstitution: 11,
      intelligenz: 8,
      weisheit: 9,
      charisma: 13
    },
    beschreibung: `Beschreibung zu ${type} ${count}`
  };

  newElement.innerHTML = `
    <h3>${charakter.name}</h3>
    <p><strong>Klasse:</strong> ${charakter.klasse}</p>
    <p><strong>Rasse:</strong> ${charakter.rasse}</p>
    <p><strong>Level:</strong> ${charakter.level}</p>
    <p><strong>Bewegung:</strong> ${charakter.bewegung} ft</p>
    <p><strong>Rüstungsklasse:</strong> ${charakter.ac}</p>
    <p><strong>HP:</strong> ${charakter.hp.aktuell} / ${charakter.hp.max}</p>
    <p><strong>Attribute:</strong></p>
    <ul class="attribute-list">
      <li>Stärke: ${charakter.attribute.staerke}</li>
      <li>Geschicklichkeit: ${charakter.attribute.geschicklichkeit}</li>
      <li>Konstitution: ${charakter.attribute.konstitution}</li>
      <li>Intelligenz: ${charakter.attribute.intelligenz}</li>
      <li>Weisheit: ${charakter.attribute.weisheit}</li>
      <li>Charisma: ${charakter.attribute.charisma}</li>
    </ul>
    <p><strong>Beschreibung:</strong> ${charakter.beschreibung}</p>
  `;

  newElement.appendChild(createEditButton(newElement));
  newElement.appendChild(createDeleteButton(newElement));

  const addButton = container.querySelector('.add-entry-block');
  container.insertBefore(newElement, addButton);
}

function createEditButton(parentElement) {
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-button';
  editBtn.textContent = 'Bearbeiten';

  editBtn.addEventListener('click', () => {
    const isEditing = parentElement.classList.toggle('editing');

    if (isEditing) {
      editBtn.textContent = 'Speichern';
      const replacements = [];
      // Name separat bearbeiten
      const h3 = parentElement.querySelector('h3');
      if (h3) {
        const nameInput = document.createElement('div');
        nameInput.innerHTML = `
          <label>Name:</label>
          <input type="text" class="edit-name" value="${h3.textContent}">
        `;
        replacements.push({ old: h3, new: nameInput });
      }

      parentElement.querySelectorAll('p, ul').forEach(element => {
        const strong = element.querySelector('strong');
        const label = strong ? strong.textContent.replace(':', '').trim() : '';
        let newEl;

        if (label === "HP") {
          const [aktuell, max] = element.textContent.match(/\d+/g) || [0, 0];
          newEl = document.createElement('div');
          newEl.innerHTML = `
            <label>HP:</label>
            <input type="number" class="edit-hp-aktuell" value="${aktuell}" style="width: 60px;"> /
            <input type="number" class="edit-hp-max" value="${max}" style="width: 60px;">
          `;
        }
        else if (label === "Attribute" || element.classList.contains("attribute-list")) {
          const attrInputs = document.createElement('div');
          element.querySelectorAll('li').forEach(li => {
            const [attr, val] = li.textContent.split(':').map(s => s.trim());
            attrInputs.innerHTML += `
              <label>${attr}:</label>
              <input type="number" class="edit-attr" data-attr="${attr.toLowerCase()}" value="${val}" style="width: 60px;"><br>
            `;
          });
          newEl = attrInputs;
        }
        else if (label) {
          const value = element.textContent.replace(strong.textContent, '').trim();
          newEl = document.createElement('div');
          newEl.innerHTML = `
            <label>${label}:</label>
            <input type="${isNaN(value) ? 'text' : 'number'}" class="edit-generic" data-label="${label}" value="${value}">
          `;
        }

        replacements.push({ old: element, new: newEl });
      });

      replacements.forEach(({ old, new: newEl }) => old.replaceWith(newEl));

    } else {
      editBtn.textContent = 'Bearbeiten';
      const values = { generic: {}, attribute: {}, hp: {} };

      values.generic["Name"] = parentElement.querySelector('h3')?.textContent || "Unbenannt";
      parentElement.querySelectorAll('input.edit-generic').forEach(input => {
        const label = input.dataset.label?.trim();
        if (label) values.generic[label] = input.value;
      });
      parentElement.querySelectorAll('input.edit-attr').forEach(input => {
        const attr = input.dataset.attr;
        values.attribute[attr] = input.value;
      });
      values.hp.aktuell = parentElement.querySelector('.edit-hp-aktuell')?.value || 0;
      values.hp.max = parentElement.querySelector('.edit-hp-max')?.value || 0;

      const attrList = Object.entries(values.attribute)
        .map(([key, val]) => `<li>${capitalize(key)}: ${val}</li>`).join("");

      parentElement.innerHTML = `
        <h3>${values.generic["Name"]}</h3>
        <p><strong>Klasse:</strong> ${values.generic["Klasse"]}</p>
        <p><strong>Rasse:</strong> ${values.generic["Rasse"]}</p>
        <p><strong>Level:</strong> ${values.generic["Level"]}</p>
        <p><strong>Bewegung:</strong> ${values.generic["Bewegung"]} ft</p>
        <p><strong>Rüstungsklasse:</strong> ${values.generic["Rüstungsklasse"]}</p>
        <p><strong>HP:</strong> ${values.hp.aktuell} / ${values.hp.max}</p>
        <p><strong>Attribute:</strong></p>
        <ul class="attribute-list">${attrList}</ul>
        <p><strong>Beschreibung:</strong> ${values.generic["Beschreibung"]}</p>
      `;

      parentElement.appendChild(editBtn);
      parentElement.appendChild(createDeleteButton(parentElement));
    }
  });

  return editBtn;
}

// ============================== Quests ==============================

function createNewQuestButton(container) {
  const type = container.dataset.type || "❖ Neue Quest";
  let count = parseInt(container.dataset.counter, 10) || 0;
  container.dataset.counter = ++count;

  const newElement = document.createElement('div');
  newElement.classList.add('quest', 'field');

  newElement.innerHTML = `
  <div class="quest-content">
    <h4>${type} ${count}</h4>
    <p><strong>Beschreibung:</strong> ...</p>
    <p><strong>Status:</strong> offen</p>
    <p><strong>Auftraggeber:</strong> ???</p>
    <p><strong>Belohnung:</strong></p>
    <ul class="reward-list">
      <li>Gold: 0</li>
      <li>XP: 0</li>
      <li>Gegenstände: -</li>
    </ul>
  </div>
`;

  newElement.appendChild(createQuestEditButton(newElement));
  newElement.appendChild(createDeleteButton(newElement));

  const addButton = container.querySelector('.add-entry-block');
  container.insertBefore(newElement, addButton);
}

function createQuestEditButton(parentElement) {
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-button';
  editBtn.textContent = 'Bearbeiten';

  editBtn.addEventListener('click', () => {
    const isEditing = parentElement.classList.toggle('editing');
    let contentDiv = parentElement.querySelector('.quest-content');

    if (!contentDiv) {
      // fallback falls es beim ersten Öffnen fehlt
      const wrapper = document.createElement('div');
      wrapper.classList.add('quest-content');
      while (parentElement.firstChild && !parentElement.firstChild.classList?.contains('edit-button')) {
        wrapper.appendChild(parentElement.firstChild);
      }
      parentElement.insertBefore(wrapper, editBtn);
      contentDiv = wrapper;
    }

    if (isEditing) {
      editBtn.textContent = 'Speichern';

      const title = contentDiv.querySelector('h4')?.textContent || '';
      const beschr = contentDiv.querySelector('p:nth-of-type(1)')?.textContent.split(':').slice(1).join(':').trim() || '';
      const status = contentDiv.querySelector('p:nth-of-type(2)')?.textContent.split(':').slice(1).join(':').trim() || '';
      const auftraggeber = contentDiv.querySelector('p:nth-of-type(3)')?.textContent.split(':').slice(1).join(':').trim() || '';
      const belohnungGold = contentDiv.querySelector('li:nth-of-type(1)')?.textContent.match(/\d+/)?.[0] || 0;
      const belohnungXP = contentDiv.querySelector('li:nth-of-type(2)')?.textContent.match(/\d+/)?.[0] || 0;
      const belohnungItems = contentDiv.querySelector('li:nth-of-type(3)')?.textContent.split(':').slice(1).join(':').trim() || '';

      contentDiv.innerHTML = `
        <label>Titel:</label><br>
        <input type="text" id="quest-titel" value="${title}"><br>
        <label>Beschreibung:</label><br>
        <textarea id="quest-beschreibung">${beschr}</textarea><br>
        <label>Status:</label><br>
        <select id="quest-status">
          <option value="offen" ${status === "offen" ? "selected" : ""}>offen</option>
          <option value="abgeschlossen" ${status === "abgeschlossen" ? "selected" : ""}>abgeschlossen</option>
        </select><br>
        <label>Auftraggeber:</label><br>
        <input type="text" id="quest-auftraggeber" value="${auftraggeber}"><br>
        <p><strong>Belohnung:</strong></p>
        <label>Gold:</label><br>
        <input type="number" id="reward-gold" value="${belohnungGold}"><br>
        <label>XP:</label><br>
        <input type="number" id="reward-xp" value="${belohnungXP}"><br>
        <label>Gegenstände:</label><br>
        <textarea id="reward-items">${belohnungItems}</textarea><br>
      `;
    } else {
      editBtn.textContent = 'Bearbeiten';

      const titel = contentDiv.querySelector('#quest-titel')?.value || '';
      const beschreibung = contentDiv.querySelector('#quest-beschreibung')?.value || '';
      const status = contentDiv.querySelector('#quest-status')?.value || 'offen';
      const auftraggeber = contentDiv.querySelector('#quest-auftraggeber')?.value || '';
      const gold = contentDiv.querySelector('#reward-gold')?.value || 0;
      const xp = contentDiv.querySelector('#reward-xp')?.value || 0;
      const gegenstaende = contentDiv.querySelector('#reward-items')?.value || '';

      contentDiv.innerHTML = `
        <h4>${titel}</h4>
        <p><strong>Beschreibung:</strong> ${beschreibung}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Auftraggeber:</strong> ${auftraggeber}</p>
        <p><strong>Belohnung:</strong></p>
        <ul class="reward-list">
          <li>Gold: ${gold}</li>
          <li>XP: ${xp}</li>
          <li>Gegenstände: ${gegenstaende}</li>
        </ul>
      `;
    }
  });

  return editBtn;
}


// ============================== Initialisierung ==============================

document.addEventListener('DOMContentLoaded', () => {
  ['character-container', 'npc-container', 'quest-container'].forEach(id => {
    initializeActionButtons(document.getElementById(id));
  });

  document.getElementById('add-character-btn')?.addEventListener('click', () => {
    addNewEntry(document.getElementById('character-container'));
  });

  document.getElementById('add-npc-btn')?.addEventListener('click', () => {
    addNewEntry(document.getElementById('npc-container'));
  });

  document.getElementById('add-Quest')?.addEventListener('click', () => {
    createNewQuestButton(document.getElementById('quest-container'));
  });
});

function initializeActionButtons(container) {
  const entries = container.querySelectorAll('.field');
  entries.forEach(entry => {
    if (!entry.querySelector('.delete-button')) {
      entry.appendChild(createDeleteButton(entry));
    }
    if (!entry.querySelector('.edit-button')) {
      if (entry.classList.contains('quest')) {
        entry.appendChild(createQuestEditButton(entry));
      } else {
        entry.appendChild(createEditButton(entry));
      }
    }
  });
}
