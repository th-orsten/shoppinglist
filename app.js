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
  
      const text = document.createElement("span");
      text.textContent = `${number} ${unit} ${product}`;
  
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️";
  
      deleteBtn.addEventListener("click", () => {
        item.remove();
        saveItems();
      });
  
      item.appendChild(text);
      item.appendChild(deleteBtn);
      outputContainer.appendChild(item);
      saveItems();
    };
  
    // Daten speichern
    const saveItems = () => {
      const items = [];
      outputContainer.querySelectorAll(".item").forEach((item) => {
        const [number, unit, ...productParts] = item.querySelector("span").textContent.split(" ");
        const product = productParts.join(" ");
        items.push({ number, unit, product });
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
  