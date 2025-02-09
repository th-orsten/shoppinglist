document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#shopping-form");
  const outputContainer = document.querySelector("#output-container");

  // Daten aus dem lokalen Speicher laden
  const loadItems = () => {
    const items = JSON.parse(localStorage.getItem("shoppingList")) || [];
    items.forEach(({ number, unit, product, completed }) => createItem(number, unit, product, completed));
  };

  // Neues Element erstellen
  const createItem = (number, unit, product, completed = false) => {
    const item = document.createElement("div");
    item.classList.add("item");

    // Textinhalt
    const text = document.createElement("span");
    text.textContent = `${number} ${unit} ${product}`;

    // Falls "completed" beim Laden gesetzt ist, übernehmen
    if (completed) {
      text.classList.add("completed");
    }

    // Button zum Umschalten des Durchstreichens
    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = "✔";
    toggleBtn.title = "Als erledigt markieren";
    toggleBtn.addEventListener("click", () => {
      text.classList.toggle("completed");
      saveItems();
    });

    // Löschbutton
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.title = "Eintrag löschen";
    deleteBtn.addEventListener("click", () => {
      item.remove();
      saveItems();
    });

    // Elemente zusammenfügen
    item.appendChild(toggleBtn);
    item.appendChild(text);
    item.appendChild(deleteBtn);
    outputContainer.appendChild(item);
    saveItems();
  };

  // Daten speichern (inklusive completed-Status)
  const saveItems = () => {
    const items = [];
    outputContainer.querySelectorAll(".item").forEach((item) => {
      const textEl = item.querySelector("span");
      const parts = textEl.textContent.split(" ");
      const number = parts[0];
      const unit = parts[1];
      const product = parts.slice(2).join(" ");
      const completed = textEl.classList.contains("completed"); // Zustand speichern
      items.push({ number, unit, product, completed });
    });
    localStorage.setItem("shoppingList", JSON.stringify(items));
  };

  // Formular verarbeiten
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

  loadItems(); // Beim Laden gespeicherte Elemente wiederherstellen
});


document.addEventListener("DOMContentLoaded", function () {
  const settingsButton = document.querySelector(".settings");
  const settingsWindow = document.getElementById("window");

  settingsButton.addEventListener("click", function () {
      settingsWindow.classList.toggle("settings-visible");
  });
});
