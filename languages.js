// source: https://codepen.io/ng07/pen/oNLLGoo

// json

const selectors = document.querySelectorAll("div.lang-selector select.selectpicker");
var appLang;
var activeLang;

var langJSON = {
    "en" : {
      "login-form-title": "Login",
      "login-email": "Enter your email address",
      "login-pw": "Enter your password",
      "login-submit-btn": "Login",
      "nav-signup-form-btn": "Sign Up",
      "signup-form-title": "Create a new account",
      "signup-email": "Enter your email address",
      "signup-username": "Create username",
      "signup-pw": "Create password",
      "signup-pw-conf": "Confirm Password",
      "initial-start-btn": "Let's begin",
      "signup-submit-btn": "Create Account",
      "nav-login-btn": "Log in",
      "search-user-input": "Search User",
      "msg-textarea" : "Type a message...",
      "signup-terms": "I agree to the <a href='#termsOfService.html'>Terms of Service</a> and acknowledge the <a target='_blank' href='privacy.html' >Privacy Policy.</a>",
      "nofriends-indicator-msg": "Use the search bar to add friends",
      "nosearchresults-error-msg" : "No results",
      "yesterday": "Yesterday",
      "today": "Today",
      "french" : "French",
      "english" : "English",
      "spanish": "Spanish",
      "photo-form-label" : "Enter the url of a public 1*1 image:",
      "photo-form-submit" : "Submit",
      "edit-info-title" : "Edit your information:",
      "edit-username-input-label" : "Username",
      "edit-submit" : "Submit",
      "logout-btn" : "Log out",
      "return-webchat-link" : "Return to Webchat",
    },
  
    "fr" : {
      "login-form-title": "Connexion",
      "login-email": "Entrez votre adresse email",
      "login-pw": "Entrez votre mot de passe",
      "login-submit-btn": "Connexion",
      "nav-signup-form-btn" : "S'inscrire",
      "signup-form-title": "Créer un nouveau compte",
      "signup-email": "Entrez votre adresse email",
      "signup-username": "Créer un nom d'utilisateur",
      "signup-pw": "Créer un mot de passe",
      "signup-pw-conf": "Confirmer le mot de passe",
      "initial-start-btn": "Démarrer",
      "signup-submit-btn": "Créer un compte",
      "nav-login-btn": "Se connecter",
      "search-user-input" : "Rechercher un utilisateur",
      "msg-textarea" : "Écrivez un message...",
      "signup-terms": "J'accepte les <a href='#termsOfService.html'>Conditions d'utilisation</a> et je prends en compte la <a target='_blank' href='privacy.html' >Confidentialité Politique.</a>",
      "nofriends-indicator-msg": "Utilisez la barre de recherche pour ajouter des amis",
      "nosearchresults-error-msg" : "Aucun résultat",
      "yesterday": "hier",
      "today": "aujourd'hui",
      "french" : "Français",
      "english" : "Anglais",
      "spanish" : "Espagnol",
      "photo-form-label" : "Entrez l'url d'une image publique 1*1",
       "photo-form-submit" : "Soumettre",
       "edit-info-title" : "Modifiez vos informations:",
       "edit-username-input-label" : "Nom d'utilisateur",
       "edit-submit" : "Soumettre",
       "logout-btn" : "Se déconnecter",
       "return-webchat-link" : "Retourner à Webchat",
    },

    "es" : {
      "login-form-title": "Iniciar sesión",
      "login-email": "Ingrese su dirección de correo electrónico",
      "login-pw": "Ingrese su contraseña",
      "login-submit-btn": "Iniciar sesión",
      "nav-signup-form-btn" : "Registrarse",
      "signup-form-title": "Crear una nueva cuenta",
      "signup-email": "Ingrese su dirección de correo electrónico",
      "signup-username": "Crear un nombre de usuario",
      "signup-pw": "Crear una contraseña",
      "signup-pw-conf": "Confirmar contraseña",
      "initial-start-btn": "Inicio",
      "signup-submit-btn": "Crear cuenta",
      "nav-login-btn": "Conectar",
      "search-user-input" : "Buscar usuario",
      "msg-textarea" : "Escribe un mensaje...",
      "signup-terms": "Acepto los <a href='#termsOfService.html'>Términos de Servicio</a> y tengo en cuenta la <a target='_blank' href='privacy.html' >Política de Privacidad.</a>",
      "nofriends-indicator-msg": "Usa la barra de búsqueda para agregar amigos",
      "nosearchresults-error-msg": "Sin resultados",
      "yesterday": "ayer",
      "today": "hoy",
      "french" : "Francés",
      "english" : "Inglés",
      "spanish" : "Español",
      "photo-form-label" : "Ingrese la URL de una imagen pública 1*1",
       "photo-form-submit": "Enviar",
       "edit-info-title" : "Edita tu información:",
       "edit-username-input-label" : "Nombre de usuario:",
       "edit-submit" : "Enviar",
       "logout-btn" : "Cerrar sesión",
       "return-webchat-link" : "Volver al Webchat",
      }
  }


// run function after page load :: get/set localstorage value and run function
document.addEventListener("DOMContentLoaded", function() {

    activeLang = localStorage.getItem('lang');
    appLang = navigator.language.substr(0, 2);

  
    // if no language value saved in local-storage, set en as default
    if((!activeLang || !langJSON[activeLang]) && appLang){
      localStorage.setItem('lang', appLang); // updaet local-storage
  
      // fun contentUpdate function with en value
      contentUpdate(appLang); 
  
      // select radiobutton which has data-value = en
    //   selector.value = appLang;
      selectorsValue(appLang);
    } else if((!activeLang || !langJSON[activeLang]) && !appLang) {
        localStorage.setItem('lang', "en"); // updaet local-storage
  
      // fun contentUpdate function with en value
      contentUpdate("en"); 
  
      // select radiobutton which has data-value = en
    //   selector.value = "en";
    selectorsValue("en");
    } else{
      // fun contentUpdate function with value from local-storage - en, ru..
      contentUpdate(activeLang); 
  
      // select radiobutton which has data-value == local storage value
    //   selector.value = activeLang;
      selectorsValue(activeLang);
    }

    document.querySelectorAll(".lang-selector").forEach((el) => {el.style.display = "inline-block"});
  });
  
  // change innerhtml on radiobtn click
//   function changeLang(langVal){
//     if (!langJSON[langVal]) {
//         console.log("language unavailable");
//         selector.value = activeLang;
//         return;
//     }

//     // set local-storage lang value from value given in onchange="changeLang(value)"
//     localStorage.setItem('lang', langVal);
  
//     // fun contentUpdate function with value from onchange="changeLang(value)"
//     contentUpdate(langVal);
//   }
  
  // content/innerhtml update/assign
  function contentUpdate(cl){
    if (!langJSON[cl]) {
        console.log("language unavailable");
        // selector.value = activeLang;
        selectorsValue(activeLang);
        return;
    }
    localStorage.setItem('lang', cl);
    activeLang = cl;
    // get current langage contents in array
    var currLang = Object.entries(langJSON)[Object.keys(langJSON).indexOf(cl)][1],
        // get current language content array length
        langCont = document.querySelectorAll('.langchange').length;
        console.log(langCont)
  
    for(let i = 0; i < langCont; i++){
      // get selectors which has .langchange classes
      var getSelector = document.querySelectorAll('.langchange')[i];
          // get data-key attribute from .langchange class selectors
        getAttr = getSelector.getAttribute('data-key');
  
      // assign the data-key value from current language array to the .langchange[data-key] selector
      if (getSelector.tagName.toLowerCase() === 'input' || getSelector.tagName.toLowerCase() === 'textarea') {
        getSelector.placeholder = currLang[getAttr];
      } else {
        getSelector.innerHTML = currLang[getAttr];
      }
    }
    if (document.querySelector("#conversationWrapper")) {
      let temp = conversationWrapper.currentConversation
      conversationWrapper.currentConversation = null;
      conversationWrapper.currentConversation = temp; 
    }
  }


selectors.forEach((el) => {
    el.addEventListener("change", () => {
        console.log(el.value);
        selectorsValue(el.value);
        contentUpdate(el.value);
    });
})

function selectorsValue(val) {
    selectors.forEach((el) => {
        el.value = val;
    })
}