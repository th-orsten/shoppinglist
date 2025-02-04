document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#shopping-form");
  const outputContainer = document.querySelector("#output-container");

  // Daten aus dem lokalen Speicher laden
  const loadItems = () => {
    const items = JSON.parse(localStorage.getItem("shoppingList")) || [];
    items.forEach(({ number, unit, product }) => createItem(number, unit, product));
  };

  // Neues Element erstellen
  const createItem = (number, unit, product) => {
    const item = document.createElement("div");
    item.classList.add("item");

    // Textinhalt
    const text = document.createElement("span");
    text.textContent = `${number} ${unit} ${product}`;

    // Button zum Umschalten des Durchstreichens
    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = "✔"; // Symbol (alternativ: HTML-Code für ein Icon)
    toggleBtn.title = "Als erledigt markieren";
    toggleBtn.addEventListener("click", () => {
      // Toggle-Klasse 'completed' an/aus
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

    // Reihenfolge: Zuerst Toggle-Button, dann Text, dann Delete-Button
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
      // Zerlege den Text in seine Bestandteile anhand von Leerzeichen
      const parts = textEl.textContent.split(" ");
      const number = parts[0];
      const unit = parts[1];
      const product = parts.slice(2).join(" ");
      // Zusätzlich könnte man auch den Status speichern:
      const completed = textEl.classList.contains("completed");
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

  loadItems();
});
