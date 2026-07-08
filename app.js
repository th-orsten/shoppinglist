document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#shopping-form");
  const outputContainer = document.querySelector("#output-container");
  const body = document.body;

  let shoppingItems = [];


  // =====================
  // AUTHENTIFIZIERUNG
  // =====================

  function unlockPage() {

    const loginOverlay =
      document.getElementById("login-overlay");

    if (loginOverlay) {
      loginOverlay.style.display = "none";
    }

    document.body.classList.remove("locked");

  }



  async function checkAuth() {

    try {

      const response = await fetch(
        "/.netlify/functions/check-auth"
      );


      const data = await response.json();


      if (data.authenticated) {

        unlockPage();

        await loadItems();

      }


    } catch (error) {

      console.error(
        "Auth Fehler:",
        error
      );

    }

  }



  const loginButton =
    document.getElementById("login-btn");


  if (loginButton) {


    loginButton.addEventListener(
      "click",
      async () => {


        const password =
          document.getElementById(
            "password-input"
          ).value;



        const response =
          await fetch(
            "/.netlify/functions/login",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                password
              })

            }
          );



        const data =
          await response.json();



        if (data.success) {


          unlockPage();

          await loadItems();


        } else {


          const message =
            document.getElementById(
              "login-message"
            );


          if (message) {

            message.textContent =
              data.message ||
              "Login fehlgeschlagen";

          }


        }


      }
    );

  }



  // =====================
  // LISTE LADEN
  // =====================


  async function loadItems() {


    try {


      const response =
        await fetch(
          "/.netlify/functions/get-list"
        );



      shoppingItems =
        await response.json();



      renderItems();



    } catch (error) {


      console.error(
        "Fehler beim Laden:",
        error
      );


    }

  }




  // =====================
  // LISTE SPEICHERN
  // =====================


  async function saveItems() {


    try {


      await fetch(
        "/.netlify/functions/save-list",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify(
              shoppingItems
            )

        }
      );



    } catch (error) {


      console.error(
        "Fehler beim Speichern:",
        error
      );


    }

  }




  // =====================
  // EINTRÄGE DARSTELLEN
  // =====================


  function renderItems() {


    outputContainer.innerHTML = "";



    shoppingItems.forEach(
      (item, index) => {


        const container =
          document.createElement(
            "div"
          );


        container.classList.add(
          "item"
        );



        const text =
          document.createElement(
            "span"
          );


        text.textContent =
          `${item.number} ${item.unit} ${item.product}`;



        if (item.completed) {

          text.classList.add(
            "completed"
          );

        }




        const toggleBtn =
          document.createElement(
            "button"
          );


        toggleBtn.innerHTML =
          "✔";


        toggleBtn.title =
          "Als erledigt markieren";



        toggleBtn.addEventListener(
          "click",
          async () => {


            shoppingItems[index].completed =
              !shoppingItems[index].completed;



            await saveItems();


            renderItems();


          }
        );




        const deleteBtn =
          document.createElement(
            "button"
          );


        deleteBtn.innerHTML =
          "🗑️";


        deleteBtn.title =
          "Eintrag löschen";



        deleteBtn.addEventListener(
          "click",
          async () => {


            shoppingItems.splice(
              index,
              1
            );


            await saveItems();


            renderItems();


          }
        );




        container.appendChild(
          toggleBtn
        );


        container.appendChild(
          text
        );


        container.appendChild(
          deleteBtn
        );



        outputContainer.appendChild(
          container
        );


      }
    );

  }




  // =====================
  // NEUER ARTIKEL
  // =====================


  form.addEventListener(
    "submit",
    async (event) => {


      event.preventDefault();



      const number =
        form.querySelector(
          ".number"
        ).value;



      const unit =
        form.querySelector(
          "#unit"
        ).value;



      const product =
        form.querySelector(
          ".product"
        ).value;




      if (
        number &&
        unit &&
        product
      ) {


        shoppingItems.push({

          number,
          unit,
          product,
          completed: false

        });



        await saveItems();


        renderItems();


        form.reset();



      } else {


        alert(
          "Bitte alle Felder ausfüllen."
        );


      }


    }
  );




  // =====================
  // LOGOUT
  // =====================


  const logoutButton =
    document.getElementById(
      "logout-btn"
    );


  if (logoutButton) {


    logoutButton.addEventListener(
      "click",
      async () => {


        await fetch(
          "/.netlify/functions/logout"
        );


        location.reload();


      }
    );

  }




  // =====================
  // EINSTELLUNGEN
  // =====================


  const settingsButton =
    document.querySelector(
      ".settings"
    );


  const settingsWindow =
    document.getElementById(
      "window"
    );



  if (
    settingsButton &&
    settingsWindow
  ) {


    settingsButton.addEventListener(
      "click",
      (event) => {


        event.stopPropagation();


        settingsWindow.classList.toggle(
          "settings-visible"
        );


      }
    );



    document.addEventListener(
      "click",
      (event) => {


        if (
          !settingsWindow.contains(
            event.target
          ) &&
          !settingsButton.contains(
            event.target
          )
        ) {


          settingsWindow.classList.remove(
            "settings-visible"
          );


        }


      }
    );

  }




  // =====================
  // FARBPROFILE
  // =====================


  const colorButtons = {

    "color-profil-1": "",
    "color-profil-2": "color2",
    "color-profil-3": "color3"

  };



  function setColorProfile(profileClass) {


    body.classList.remove(
      "color2",
      "color3"
    );



    if (profileClass) {

      body.classList.add(
        profileClass
      );

    }



    localStorage.setItem(
      "colorProfile",
      profileClass || ""
    );


  }




  document
    .querySelectorAll(
      ".color-settings button"
    )
    .forEach(
      (button) => {


        button.addEventListener(
          "click",
          () => {


            const profileClass =
              colorButtons[
                button.classList[0]
              ];



            setColorProfile(
              profileClass
            );


          }
        );


      }
    );




  const savedColorProfile =
    localStorage.getItem(
      "colorProfile"
    );


  if (savedColorProfile) {

    body.classList.add(
      savedColorProfile
    );

  }



  // Start

  checkAuth();


});




// =====================
// CONSENT HANDLING
// =====================


const overlay =
  document.getElementById(
    "consent-overlay"
  );


const acceptBtn =
  document.getElementById(
    "accept-btn"
  );


const declineBtn =
  document.getElementById(
    "decline-btn"
  );



if (
  overlay &&
  acceptBtn &&
  declineBtn
) {


  const consentGiven =
    localStorage.getItem(
      "consentAccepted"
    );



  if (consentGiven === "true") {

    overlay.style.display =
      "none";

  }



  acceptBtn.addEventListener(
    "click",
    () => {


      localStorage.setItem(
        "consentAccepted",
        "true"
      );


      overlay.style.display =
        "none";


    }
  );



  declineBtn.addEventListener(
    "click",
    () => {


      alert(
        "Um die Seite zu nutzen, müssen Sie den Datenschutzhinweis akzeptieren."
      );


    }
  );

}