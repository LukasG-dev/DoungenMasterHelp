// navbar laden + active-Klasse setzen
function loadNavbar() {
  fetch("/DoungnenMasterHelp/navbar/navbar.html")
    .then((res) => res.text())
    .then((data) => {
      const placeholder = document.getElementById("navbar-placeholder");
      if (placeholder) {
        placeholder.innerHTML = data;

        // active-Klasse setzen basierend auf Pfad
        const current = window.location.pathname.toLowerCase();
        document.querySelectorAll("nav a").forEach((link) => {
          const page = link.getAttribute("data-page");
          if (page && current.includes(page)) {
            link.classList.add("active"); // vllt irgend eine andere Farbe?
          }
        });
      }
    });
}
window.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
});

// Speichern aller daten in einer JSON
function saveDataAsJSON() {
  const data = {
    charaktere: extractCharacterData(
      document.getElementById("character-container")
    ),
    npcs: extractCharacterData(document.getElementById("npc-container")),
    quests: extractQuestData(document.getElementById("quest-container")),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "dnd_daten.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function extractCharacterData(container) {
  const characters = [];
  const entries = container.querySelectorAll(".character.field");

  entries.forEach((entry) => {
    const name = entry.querySelector("h3")?.textContent || "Unbenannt";

    const getValue = (label) => {
      const pList = entry.querySelectorAll("p");
      for (let p of pList) {
        if (p.textContent.startsWith(label + ":")) {
          return p.textContent.split(":")[1].trim().split(" ")[0]; // ggf. " ft" entfernen
        }
      }
      return "";
    };

    const [hpAktuell, hpMax] = (
      entry.textContent.match(/HP:\s*(\d+)\s*\/\s*(\d+)/) || [0, 0, 0]
    )
      .slice(1)
      .map(Number);

    const attr = {};
    entry.querySelectorAll(".attribute-list li").forEach((li) => {
      const [key, val] = li.textContent.split(":").map((s) => s.trim());
      attr[key.toLowerCase()] = parseInt(val, 10);
    });

    characters.push({
      name,
      klasse: getValue("Klasse"),
      rasse: getValue("Rasse"),
      level: parseInt(getValue("Level")),
      bewegung: parseInt(getValue("Bewegung")),
      ac: parseInt(getValue("Rüstungsklasse")),
      hp: { aktuell: hpAktuell, max: hpMax },
      attribute: attr,
      beschreibung: getValue("Beschreibung"),
    });
  });

  return characters;
}

function extractQuestData(container) {
  const quests = [];
  const entries = container.querySelectorAll(".quest.field");

  entries.forEach((entry) => {
    const titel = entry.querySelector("h4")?.textContent || "Unbenannt";
    const pList = entry.querySelectorAll("p");

    const getText = (label) => {
      for (let p of pList) {
        if (p.textContent.startsWith(label + ":")) {
          return p.textContent.split(":").slice(1).join(":").trim();
        }
      }
      return "";
    };

    const li = entry.querySelectorAll("ul.reward-list li");
    const gold = li[0]?.textContent.match(/\d+/)?.[0] || 0;
    const xp = li[1]?.textContent.match(/\d+/)?.[0] || 0;
    const items = li[2]?.textContent.split(":")[1]?.trim() || "";

    quests.push({
      titel,
      beschreibung: getText("Beschreibung"),
      status: getText("Status"),
      auftraggeber: getText("Auftraggeber"),
      belohnung: {
        gold: parseInt(gold),
        xp: parseInt(xp),
        gegenstaende: items,
      },
    });
  });

  return quests;
}

function loadDataFromJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      // Container leeren
      document
        .getElementById("character-container")
        .querySelectorAll(".character.field")
        .forEach((el) => el.remove());
      document
        .getElementById("npc-container")
        .querySelectorAll(".character.field")
        .forEach((el) => el.remove());
      document
        .getElementById("quest-container")
        .querySelectorAll(".quest.field")
        .forEach((el) => el.remove());

      // Einträge wiederherstellen
      if (data.charaktere) loadCharaktere(data.charaktere);
      if (data.npcs) loadNPCs(data.npcs);
      if (data.quests) loadQuests(data.quests);
    } catch (err) {
      alert("Fehler beim Laden der Datei: " + err.message);
    }
  };

  reader.readAsText(file);
}
function loadCharaktere(liste) {
  const container = document.getElementById("character-container");
  liste.forEach((c) => {
    const newElement = document.createElement("div");
    newElement.classList.add("character", "field");
    newElement.innerHTML = `
        <h3>${c.name}</h3>
        <p><strong>Klasse:</strong> ${c.klasse}</p>
        <p><strong>Rasse:</strong> ${c.rasse}</p>
        <p><strong>Level:</strong> ${c.level}</p>
        <p><strong>Bewegung:</strong> ${c.bewegung} ft</p>
        <p><strong>Rüstungsklasse:</strong> ${c.ac}</p>
        <p><strong>HP:</strong> ${c.hp.aktuell} / ${c.hp.max}</p>
        <p><strong>Attribute:</strong></p>
        <ul class="attribute-list">
          <li>Stärke: ${c.attribute.staerke}</li>
          <li>Geschicklichkeit: ${c.attribute.geschicklichkeit}</li>
          <li>Konstitution: ${c.attribute.konstitution}</li>
          <li>Intelligenz: ${c.attribute.intelligenz}</li>
          <li>Weisheit: ${c.attribute.weisheit}</li>
          <li>Charisma: ${c.attribute.charisma}</li>
        </ul>
        <p><strong>Beschreibung:</strong> ${c.beschreibung}</p>
      `;
    newElement.appendChild(createEditButton(newElement));
    newElement.appendChild(createDeleteButton(newElement));
    container.insertBefore(
      newElement,
      container.querySelector(".add-entry-block")
    );
  });
}
function loadNPCs(liste) {
  const container = document.getElementById("npc-container");
  liste.forEach((c) => {
    const newElement = document.createElement("div");
    newElement.classList.add("character", "field");
    newElement.innerHTML = `
        <h3>${c.name}</h3>
        <p><strong>Klasse:</strong> ${c.klasse}</p>
        <p><strong>Rasse:</strong> ${c.rasse}</p>
        <p><strong>Level:</strong> ${c.level}</p>
        <p><strong>Bewegung:</strong> ${c.bewegung} ft</p>
        <p><strong>Rüstungsklasse:</strong> ${c.ac}</p>
        <p><strong>HP:</strong> ${c.hp.aktuell} / ${c.hp.max}</p>
        <p><strong>Attribute:</strong></p>
        <ul class="attribute-list">
          <li>Stärke: ${c.attribute.staerke}</li>
          <li>Geschicklichkeit: ${c.attribute.geschicklichkeit}</li>
          <li>Konstitution: ${c.attribute.konstitution}</li>
          <li>Intelligenz: ${c.attribute.intelligenz}</li>
          <li>Weisheit: ${c.attribute.weisheit}</li>
          <li>Charisma: ${c.attribute.charisma}</li>
        </ul>
        <p><strong>Beschreibung:</strong> ${c.beschreibung}</p>
      `;
    newElement.appendChild(createEditButton(newElement));
    newElement.appendChild(createDeleteButton(newElement));
    container.insertBefore(
      newElement,
      container.querySelector(".add-entry-block")
    );
  });
}
function loadQuests(liste) {
  const container = document.getElementById("quest-container");
  liste.forEach((q) => {
    const newElement = document.createElement("div");
    newElement.classList.add("quest", "field");
    newElement.innerHTML = `
        <h4>${q.titel}</h4>
        <p><strong>Beschreibung:</strong> ${q.beschreibung}</p>
        <p><strong>Status:</strong> ${q.status}</p>
        <p><strong>Auftraggeber:</strong> ${q.auftraggeber}</p>
        <p><strong>Belohnung:</strong></p>
        <ul class="reward-list">
          <li>Gold: ${q.belohnung.gold}</li>
          <li>XP: ${q.belohnung.xp}</li>
          <li>Gegenstände: ${q.belohnung.gegenstaende}</li>
        </ul>
      `;
    newElement.appendChild(createQuestEditButton(newElement));
    newElement.appendChild(createDeleteButton(newElement));
    container.insertBefore(
      newElement,
      container.querySelector(".add-entry-block")
    );
  });
}
