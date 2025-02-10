document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#shopping-form");
  const outputContainer = document.querySelector("#output-container");
  const body = document.body;

  // Daten aus dem lokalen Speicher laden
  const loadItems = () => {
    const items = JSON.parse(localStorage.getItem("shoppingList")) || [];
    items.forEach(({ number, unit, product, completed }) => createItem(number, unit, product, completed));
  };

  // Neues Element erstellen
  const createItem = (number, unit, product, completed = false) => {
    const item = document.createElement("div");
    item.classList.add("item");

    const text = document.createElement("span");
    text.textContent = `${number} ${unit} ${product}`;

    if (completed) {
      text.classList.add("completed");
    }

    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = "✔";
    toggleBtn.title = "Als erledigt markieren";
    toggleBtn.addEventListener("click", () => {
      text.classList.toggle("completed");
      saveItems();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.title = "Eintrag löschen";
    deleteBtn.addEventListener("click", () => {
      item.remove();
      saveItems();
    });

    item.appendChild(toggleBtn);
    item.appendChild(text);
    item.appendChild(deleteBtn);
    outputContainer.appendChild(item);
    saveItems();
  };

  // Daten speichern
  const saveItems = () => {
    const items = [];
    outputContainer.querySelectorAll(".item").forEach((item) => {
      const textEl = item.querySelector("span");
      const parts = textEl.textContent.split(" ");
      const number = parts[0];
      const unit = parts[1];
      const product = parts.slice(2).join(" ");
      const completed = textEl.classList.contains("completed");
      items.push({ number, unit, product, completed });
    });
    localStorage.setItem("shoppingList", JSON.stringify(items));
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const number = form.querySelector(".number").value;
    const unit = form.querySelector("#unit").value;
    const product = form.querySelector(".product").value;

    if (number && unit && product) {
      createItem(number, unit, product);
      form.reset();
    } else {
      alert("Bitte alle Felder ausfüllen.");
    }
  });

  loadItems();

  // Einstellungen-Fenster öffnen und schließen
  const settingsButton = document.querySelector(".settings");
  const settingsWindow = document.getElementById("window");

  settingsButton.addEventListener("click", function (event) {
    event.stopPropagation();
    settingsWindow.classList.toggle("settings-visible");
  });

  document.addEventListener("click", function (event) {
    if (!settingsWindow.contains(event.target) && !settingsButton.contains(event.target)) {
      settingsWindow.classList.remove("settings-visible");
    }
  });

  // Farbprofil-Funktionalität
  const colorButtons = {
    "color-profil-1": "",
    "color-profil-2": "color2",
    "color-profil-3": "color3"
  };

  const setColorProfile = (profileClass) => {
    body.classList.remove("color2", "color3");
    if (profileClass) {
      body.classList.add(profileClass);
    }
    localStorage.setItem("colorProfile", profileClass || "");
  };

  document.querySelectorAll(".color-settings button").forEach((button) => {
    button.addEventListener("click", () => {
      const profileClass = colorButtons[button.classList[0]];
      setColorProfile(profileClass);
    });
  });

  // Beim Laden gespeichertes Farbprofil wiederherstellen
  const savedColorProfile = localStorage.getItem("colorProfile");
  if (savedColorProfile) {
    body.classList.add(savedColorProfile);
  }
});
