// html elements
const searchBarWrapper = document.querySelector("#searchBarWrapper");
const searchInput = document.querySelector("#searchInput");

const searchButton = document.querySelector("#searchButton");
const searchIcon = document.querySelector(".searchIcon");

const nextButton = document.querySelector("#nextButton");
const introScreen = document.querySelector(".introScreen");

const signUpPassword = document.querySelector("#signUpPassword");
const signUpPasswordC = document.querySelector("#signUpPasswordC");
const signUpEmail = document.querySelector("#signUpEmail");
const createAccountButton = document.querySelector("#createAccountButton");
const loginToAccountButton = document.querySelector("#loginToAccountButton");
const contactsList = document.querySelector(".contacts");
const contactsDiv = document.querySelector(".convoNlistWrapper .contacts");
const closeSearchButton = document.querySelector("#navBar #searchBarWrapper #closeSearch");


console.log("%cStop!", "color:red; font-size:40px; font-weight:bolder; font-family:arial;");
console.log("%cN'essayez pas de pirater " + "%cwebchat " + "%cLe site est sécurisé donc vous perdez votre temps.", "color:blue; font-size:20px; font-family:arial; ", "font-size:20px; font-family:sans-serif; font-weight:bold;", "color:blue; font-size:20px; font-family:arial;");

// store oldest message doc
let latestDoc;

if (window.innerWidth < 700) {
    document.querySelector("body").addEventListener("click", () => {
        document.querySelector("body").requestFullscreen();
    })
}

closeSearchButton.addEventListener("click", () => {
    searchInput.value = ""
    app.searchUsersArray = [];
    document.querySelector(".contacts .searchError").style.display = "none";
    app.currentDisplayStatus = "none";
    searchInput.focus();
});

function addToContacts(contactUID, contactDisplayName, event, searchedUserObject) {
    // console.log(`adding ${contactDisplayName} with the UID of: ${contactUID}`);
    // console.log(event.currentTarget);
    const TargetButton = event.currentTarget;
    TargetButton.querySelector("span").style.display = "none";
    TargetButton.querySelector("img").style.display = "block";
    const addUsertoContacts = firebase.functions().httpsCallable("addUsertoContacts");
    addUsertoContacts({
        uid: contactUID,
    }).then(result => {
        // console.log(result.data.message);
        TargetButton.querySelector("span").style.display = "block";
        TargetButton.querySelector("img").style.display = "none";
        // console.log(searchedUserObject);
        app.contactUsersArray.unshift(searchedUserObject);
        // console.log(app.contactUsersArray);
        updateContacts();
    }).catch(err => {
        console.error(err.message)
        TargetButton.querySelector("span").style.display = "block";
        TargetButton.querySelector("img").style.display = "none";
    })
}

function removeFromContacts(contactUID, contactDisplayName, event, searchedUserObject) {
    const TargetButton = event.currentTarget;
    TargetButton.querySelector("span").style.display = "none";
    TargetButton.querySelector("img").style.display = "block";
    const removeUsersfromContacts = firebase.functions().httpsCallable("removeUsersfromContacts");
    removeUsersfromContacts({
        uid: contactUID,
    }).then(result => {
        console.log(result.data);
        TargetButton.querySelector("span").style.display = "block";
        TargetButton.querySelector("img").style.display = "none";
        // console.log(searchedUserObject);
        app.contactUsersArray = removeItem(app.contactUsersArray, searchedUserObject);
        document.querySelectorAll(".openMoreButton").forEach(el => el.classList.remove("open"))
        // console.log(app.contactUsersArray);
        updateContacts();
    }).catch(err => {
        console.error(err.message)
        TargetButton.querySelector("span").style.display = "block";
        TargetButton.querySelector("img").style.display = "none";
    })
}

// <---------- vuejs ---------->
var app = new Vue({
    el: '#app',
    data: {
        searchUsersArray: [],
        contactUsersArray: []
    }
})
var conversationWrapper = new Vue({
    el: '#conversationWrapper',
    data: {
        currentConversation: [],
        pendingMessages: [],
        currentConversationInfo: {},
    }
})

app.currentDisplayStatus = "block";
// event listeners

//login&signup related listeners
document.querySelector(".signUpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (signUpPassword.value != signUpPasswordC.value) {
        // console.log("Make sure to enter the same password")
        document.querySelector(".signUp-error").innerText = "Make sure to enter the same password";
        document.querySelector(".signUp-error").classList.add("on");
        return;
    }
    // console.log(signUpEmail.value, signUpPassword.value);
    document.querySelector("#signUpSubmit img").style.display = "inline";
    document.querySelector("#signUpSubmit p").style.display = "none";
    auth.createUserWithEmailAndPassword(signUpEmail.value, signUpPassword.value).then((result) => {
        // console.log(result.additionalUserInfo.isNewUser)
        // console.log(result)
        document.querySelector("#signUpSubmit p").style.display = "inline";
        document.querySelector("#signUpSubmit img").style.display = "none";
        firebase.auth().currentUser.updateProfile({
            displayName: document.querySelector("#signUpName").value
        });
    }).catch((err) => {
        // console.log(err.message)
        document.querySelector(".signUp-error").innerText = err.message;
        document.querySelector(".signUp-error").classList.add("on");
        document.querySelector("#signUpSubmit p").style.display = "inline";
        document.querySelector("#signUpSubmit img").style.display = "none";
    });
})
document.querySelector(".loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log("hello world")
    document.querySelector("#loginSubmit img").style.display = "inline";
    document.querySelector("#loginSubmit p").style.display = "none";
    auth.signInWithEmailAndPassword(loginEmail.value, loginPassword.value).then((result) => {
        // console.log(result);
        document.querySelector("#loginSubmit p").style.display = "inline";
        document.querySelector("#loginSubmit img").style.display = "none";
    }).catch((err) => {
        // console.log(err.message)
        document.querySelector(".login-error").innerText = err.message;
        document.querySelector(".login-error").classList.add("on");
        document.querySelector("#loginSubmit p").style.display = "inline";
        document.querySelector("#loginSubmit img").style.display = "none";
    })
})

createAccountButton.addEventListener("click", () => {
    document.querySelector(".loginFormWrapper").style.animation = "growLoginForm 100ms ease-out 1 forwards";
    document.querySelectorAll(".loginFormWrapper *").forEach((e) =>{e.style.animation = "collapse 100ms ease-out 1 forwards"});
    setTimeout(() => {
        document.querySelectorAll(".signUpFormWrapper *").forEach((e) =>{e.style.animation = "collapse 100ms ease-out 1 forwards reverse"});
        document.querySelectorAll(".loginFormWrapper *").forEach((e) =>{e.style.animation = "none"});
        document.querySelector(".loginFormWrapper").style.animation = "none";
        document.querySelector(".signUpFormWrapper").style.display = "inline-block";
        document.querySelector(".loginFormWrapper").style.height = "fit-content";
        document.querySelector(".loginFormWrapper").style.display = "none";
        document.querySelector("#signUpEmail").focus();
    }, 100);

    document.querySelector(".login-error").classList.remove("on");
})
loginToAccountButton.addEventListener("click", () => {
    document.querySelector(".signUpFormWrapper").style.animation = "shrinkSignUpForm 100ms ease-out 1 forwards";
    // document.querySelectorAll(".secondPassword, .signUpNameDiv, #agreementCheckbox, .agreementLabel").forEach((e) =>{e.style.animation = "collapse 300ms ease-out 1 forwards"});
    document.querySelectorAll(".signUpFormWrapper *").forEach((e) =>{e.style.animation = "collapse 100ms ease-out 1 forwards normal"});
    // document.querySelector(".signUpPasswordDiv").style.animation = "collapse 300ms ease-out 1 forwards";
    setTimeout(() => {
        document.querySelectorAll(".loginFormWrapper *").forEach((e) =>{e.style.animation = "collapse 100ms ease-out 1 forwards reverse"});
    document.querySelectorAll(".signUpFormWrapper *").forEach((e) =>{e.style.animation = "none"});
    document.querySelector(".signUpFormWrapper").style.animation = "none";
    document.querySelector(".signUpFormWrapper").style.height = "fit-content";
    document.querySelector(".signUpFormWrapper").style.display = "none";
    document.querySelector(".loginFormWrapper").style.display = "inline-block";
    document.querySelector("#loginEmail").focus();
    }, 100);
    document.querySelector(".signUp-error").classList.remove("on");
})

//styling related listeners
function toggleButton(event) {
    const TargetButton = event.currentTarget;
    // console.log(TargetButton);
    TargetButton.classList.toggle("open");
}

function closetoggleButtons(event) {
    // console.log(event.relatedTarget)
        if (event.relatedTarget && event.relatedTarget.classList.contains("removeContact")) {
            return;
        }
    const TargetButton = event.currentTarget
    document.querySelectorAll(".openMoreButton").forEach(el => el.classList.remove("open"))
}

searchInput.addEventListener("focus", () => {
    searchBarWrapper.style.border = "solid rgb(55, 125, 230) 1px";
    searchBarWrapper.style.backgroundColor = "rgb(255, 255, 255, 1)";
})
searchInput.addEventListener("blur", () => {
    searchBarWrapper.style.border = "solid transparent 1px";
    searchBarWrapper.style.backgroundColor = "rgb(255, 255, 255, 0.6)";
})

const textarea = document.querySelector(".convoNlistWrapper .conversationWrapper .inputArea .chatInput");

var scHeight = 30;
setInterval(() => {
    textarea.style.height = "32px";
    if (scHeight != textarea.scrollHeight) {
        var scHeight = textarea.scrollHeight;
        textarea.style.height = `${scHeight}px`;
    }
    if (searchInput.value) {
        closeSearchButton.style.display = "inline-block";
    } else {
        closeSearchButton.style.display = "none";
        app.searchUsersArray = [];
        document.querySelector(".contacts .searchError").style.display = "none";
        app.currentDisplayStatus = "block"
    }
}, 50);


// account page button event listener

document.querySelector("#profilePicWrapper").addEventListener("click", () => {
    location.href = "profile.html";
})


//
//
// SEARCH USERS LISTENERS
searchButton.addEventListener("click", () => {
    if (searchInput.value.length == 0) {
        // console.log("error bitch");
        searchIcon.style.animation = "searchButtonAnimationError 400ms 1 forwards linear";
        setTimeout(() => { searchIcon.style.animation = "none"; }, 400)
        document.querySelector("#searchBarWrapper").style.borderColor = "red";
        setTimeout(() => { document.querySelector("#searchBarWrapper").style.borderColor = "rgb(255, 255, 255, 0.6)"; }, 1000)
        return;
    }

    document.querySelector("#searchBarWrapper").style.borderColor = "rgb(55, 125, 230)";
    setTimeout(() => { document.querySelector("#searchBarWrapper").style.borderColor = "rgb(255, 255, 255, 0.6)"; }, 1000)
    // console.log(searchInput.value);
    searchUsers(searchInput.value);
    searchIcon.style.animation = "searchButtonAnimation 200ms 1 forwards linear";
    setTimeout(() => { searchIcon.style.animation = "none"; }, 200)
})
searchInput.addEventListener("keyup", (e) => {
    if (searchInput.value.length == 0 && e.which == 13) {
        // console.log("you need to enter sum")
        document.querySelector("#searchBarWrapper").style.borderColor = "red";
        setTimeout(() => { document.querySelector("#searchBarWrapper").style.borderColor = "rgb(55, 125, 230)"; }, 1000)
        return;
    } else if (e.which == 13) {
        // console.log(searchInput.value);
        searchUsers(searchInput.value);
    }
})

//search function
function searchUsers(userInput) {
    app.currentDisplayStatus = "none";
    // console.log("searching users with the name " + userInput)
    app.searchUsersArray = [];
    document.querySelector(".contacts .searchError").style.display = "none";
    document.querySelector(".contacts .loadingCircle").style.display = "inline-block";

    let friend = ``;
    //get function reference
    const searchUsersFunction = firebase.functions().httpsCallable("searchUsersFunction");
    searchUsersFunction({
        userInput: userInput,
    }).then(result => {
        // console.log(result.data);
        document.querySelector(".contacts .loadingCircle").style.display = "none";
        app.searchUsersArray = result.data;
    }).catch(error => {
        console.error(error.message);
        // console.log("failed");
        app.searchUsersArray = [];
        document.querySelector(".contacts .loadingCircle").style.display = "none";
        document.querySelector(".contacts .searchError").style.display = "inline-block";
    })
}

textarea.addEventListener("keydown", (e) => {
    // Enter was pressed without shift key
    if (e.keyCode == 13 && !e.shiftKey) {
        // prevent default behavior
        e.preventDefault();
        // console.log("sending message");
        sendMessageFunction(conversationWrapper.currentConversationInfo.uid, textarea.value);
    }
});

document.querySelector(".sendMessageForm").addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log("sending message");
    sendMessageFunction(conversationWrapper.currentConversationInfo.uid, textarea.value);
    // conversationDiv.innerHTML = `<div class="message-inner-wrapper"><div class="outgoing-message-content"><span>${textarea.value}</span></div></div>${conversationDiv.innerHTML}`;
})

const removeItem = (arr, value) => {
    let i = 0;
    while (i < arr.length) {
        if (JSON.stringify(arr[i]) == JSON.stringify(value)) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
};

// SEND message function
function sendMessageFunction(contactUID, message) {
    textarea.focus();
    if (message <= 0) {
        console.error("you messed up");
        return;
    }
    // console.log(message);

    // array of haram words
    // const conditions = ["cock", "fesse", "tabarnak", "suce ma queue", "suce ma bite", "anal", "poop", "caca", "winnie the pooh", "tiananmen square", "shit", "piss off", "asshole", "arsehole", "bitch", "bastard", "cunt", "penis", "vagin", "dick", "fuck", " anus", "sex", "putin", "bloody hell", "wanker", "twat", "pussy", "get stuffed", "je t’emmerde", "foutre", "enculer", "casse-toi", "barre-toi", " con ", "connasse", "salaud", "salope", "tapette", "ta gueule", "tais-toi"];

    let newArr = removeItem(app.contactUsersArray, conversationWrapper.currentConversationInfo);
    app.contactUsersArray = [conversationWrapper.currentConversationInfo, ...newArr];
    textarea.value = "";
    conversationWrapper.currentConversation.unshift({ sentBy: auth.currentUser.uid, text: message, createdAt: new Date(), pendingMessage: true });
    conversationDiv.scrollTop = 0;

    // document.querySelector(".pendingMessage .outgoing-message-content").style.animation = "showPendingMessage 300ms ease-in repete";
    const sendMessage = firebase.functions().httpsCallable("sendMessage");
    sendMessage({
        contactUID: contactUID,
        messageText: message,
    }).then(result => {
        if (result.data[1]) {
            console.log("+69 000 social credit");
            document.querySelector(".social-credit-score").style.display = "inline-block";
            document.querySelector(".social-credit-score img").src = result.data[1];
            setTimeout(() => {document.querySelector(".social-credit-score").style.display = "none"}, 2000)
        }
    }).catch((err) => { console.error(err) })

}


var unsubscribeConversation;
// OPEN conversation function
function openConversation(contactObject, event) {
    if (event) {
        if (event.target.classList.contains("openMoreButton") || event.target.parentNode.classList.contains("openMoreButton") || event.target.parentNode.classList.contains("moreDiv") || event.target.classList.contains("moreDiv") || event.target.parentNode.parentNode.classList.contains("moreDiv")) {
            // console.log(event.target);
            // console.log(event.currentTarget)
            return;
        }
    }


    latestDoc = undefined;
    // cloud function
    // console.log(event, contactUID)
    if (unsubscribeConversation) {
        unsubscribeConversation();
    }

    conversationWrapper.currentConversation = [];
    let conversationID = [auth.currentUser.uid, contactObject.uid].sort()[0] + [auth.currentUser.uid, contactObject.uid].sort()[1]
    const ref = db.collection("conversations").doc(conversationID).collection("messages").orderBy("createdAt", "desc").limit(20);
    // console.log(conversationID)
    conversationWrapper.currentConversationInfo = contactObject;
    let array = [];
    unsubscribeConversation = ref.onSnapshot((result) => {
        latestDoc = result.docs[result.docs.length - 1];
        conversationWrapper.pendingMessages.shift();
        result.docs.forEach(doc => {
            let date = new Date(doc.data().createdAt.seconds * 1000)
            array.push({
                text: doc.data().text,
                sentBy: doc.data().sentBy,
                createdAt: date,
            });
        });
        conversationWrapper.currentConversation = array;
        // console.log(array)
        document.querySelector(".conversation .loadingCircle").style.display = "inline-block";
        if (array.length < 20) document.querySelector(".conversation .loadingCircle").style.display = "none";
        array = [];
        conversationDiv.scrollTop = 0;
    });
    // <-----add the firestore conversation listener HEREEEEEE!-------------------->
    // console.log("opening conversation")
}

function secondsToDate(date) {
    return date.getDate()+
    "-"+(date.getMonth()+1)+
    "-"+date.getFullYear()+
    " "+date.getHours()+
    ":"+date.getMinutes()
}

//authentication state listener
auth.onAuthStateChanged(user => {
    document.querySelector(".introtextWrapper #nextButton img").style.display = "none";
    // document.querySelector("main").style.display = "block";
    if (user) {
        // console.log("logged in")
        document.querySelector(".loginScreen").style.display = "none";
        introScreen.style.animation = "introScreenAnimation 500ms 1 forwards cubic-bezier(.69,.13,.62,1)";

        if (auth.currentUser.photoURL) {
            document.querySelector("#navBar #profilePicWrapper img").src = auth.currentUser.photoURL;
        }
        document.querySelector(".contacts .loadingCircle").style.display = "inline-block";
        updateContacts();
        setTimeout(() => {
            introScreen.style.display = "none";
        }, 500)
    } else {
        // loginEmail.value = "test123@gmail.com";
        // loginPassword.value = "123456";
        // document.querySelector("#loginSubmit").click();
        // console.log("logged out")
        document.querySelector(".introtextWrapper #nextButton").style.backgroundColor = "rgb(55, 125, 230)";
        document.querySelector(".introtextWrapper #nextButton").style.boxShadow = "0 5px 10px 3px rgb(125, 156, 202)";
        document.querySelector(".introtextWrapper #nextButton p").style.display = "inline";
        document.querySelector(".loginScreen").style.display = "block";
        nextButton.addEventListener("click", () => {
            // console.log("hello world")
            introScreen.style.animation = "introScreenAnimation 800ms 1 forwards cubic-bezier(.69,.13,.62,1)";
            setTimeout(() => {
                introScreen.style.display = "none";
                loginEmail.focus();
            }, 800)
        })
    }
})

var timeOut;
//internet connection listener
window.addEventListener('offline', () => {
    document.querySelector(".error-popup .wifi-icon").src = "signal_wifi_statusbar_connected_no_internet_4_black_24dp.svg";
    document.querySelector(".error-popup").style.display = "inline-block";
    document.querySelector(".error-popup .error-text").innerHTML = "Connection internet perdue";
    clearTimeout(timeOut);
});
window.addEventListener('online', () => {
    document.querySelector(".error-popup .wifi-icon").src = "signal_wifi_statusbar_4_bar_black_24dp.svg";
    document.querySelector(".error-popup").style.display = "inline-block";
    document.querySelector(".error-popup .error-text").innerHTML = "Connection internet retrouvée";
    timeOut = setTimeout(() => {
        document.querySelector(".error-popup").style.display = "none";
    }, 6000);
});
// console.log(window.navigator.onLine)
if (!window.navigator.onLine) {
    // console.log("no internet connection")
    document.querySelector(".error-popup").style.display = "inline-block";
} else {
    // console.log("internet connection established")
}

// console.log(document.querySelector(".error-popup"));

function updateContacts() {
    const fetchContactsFunction = firebase.functions().httpsCallable("fetchContactsFunction");
    fetchContactsFunction().then(results => {
        // console.log(results);
        // console.log(results.data);
        document.querySelector(".contacts .loadingCircle").style.display = "none";
        app.contactUsersArray = results.data;
        openConversation(app.contactUsersArray[0]);
        // openConversation(app.contactUsersArray[0]);
    }).catch((err) => {
        console.error(err.message);
        // console.log("uniends")
        document.querySelector(".contacts .loadingCircle").style.display = "none";
        document.querySelector(".contacts .noFriendsWarning").style.display = "inline-block";
    })
}

const conversationDiv = document.querySelector(".conversation");

document.querySelector(".scrollDownConvoButton").addEventListener("click", () => {
    conversationDiv.scrollTop = 0;
})

let req = false
conversationDiv.addEventListener("scroll", () => {
    let triggerHeight = conversationDiv.offsetHeight - conversationDiv.scrollTop;
    if (triggerHeight + 500 >= conversationDiv.scrollHeight && conversationWrapper.currentConversation.length >= 20) {
        if (!req) {
            req = true;
            console.log("requesting")
            getPreviousMessages();
        }
    }

    if (conversationDiv.scrollTop >= -100) {
        document.querySelector(".scrollDownConvoButton").classList.remove("scrollDownConvoButtonOn");
    } else {
        document.querySelector(".scrollDownConvoButton").classList.add("scrollDownConvoButtonOn");
    }
})

function getPreviousMessages() {

    // console.log(latestDoc);
    let conversationID = [auth.currentUser.uid, conversationWrapper.currentConversationInfo.uid].sort()[0] + [auth.currentUser.uid, conversationWrapper.currentConversationInfo.uid].sort()[1]
    const ref = db.collection("conversations").doc(conversationID).collection("messages").orderBy("createdAt", "desc").startAfter(latestDoc).limit(20);
    ref.get().then((data) => {
        // console.log(data.docs);
    data.docs.forEach(doc => {
        let date = new Date(doc.data().createdAt.seconds * 1000)
        conversationWrapper.currentConversation.push({
        text: doc.data().text,
        sentBy: doc.data().sentBy,
        createdAt: date,
    });
    });
    // update oldest message doc
    if (data.docs[data.docs.length - 1]) {
        latestDoc = data.docs[data.docs.length - 1];
    }

    if (data.docs.length < 20) {document.querySelector(".conversation .loadingCircle").style.display = "none";}
    req = false;
    })
}

function checkTimestamp(messageObject) {
    // Mon Jan 10 2022, 1:42:36 PM
    let messageTime = messageObject.createdAt.getTime();
    let prevMessageIndex = conversationWrapper.currentConversation.indexOf(messageObject) + 1;
    if (prevMessageIndex > conversationWrapper.currentConversation.length - 1) return false;
    let prevMessageTime = conversationWrapper.currentConversation[prevMessageIndex].createdAt.getTime();
    return messageTime - prevMessageTime;
}

function styleMessage(messageObject) {
    let i = conversationWrapper.currentConversation.indexOf(messageObject);
    let author = messageObject.sentBy;
    let y = "17";
    let n = "3";
    let a = y;
    let b = y;
    let c = y;
    let d = y;
    let prevAuthor;
    if (i + 2 <= conversationWrapper.currentConversation.length) {
        prevAuthor = conversationWrapper.currentConversation[i + 1].sentBy;
    } else {
        prevAuthor = null;
    }
    let nextAuthor;
    if (i > 0) {
        nextAuthor = conversationWrapper.currentConversation[i - 1].sentBy;
    } else {
        nextAuthor = null;
    }
    
    if (author == auth.currentUser.uid) {
        if (prevAuthor == author) {
            b = n;
        }
        if (nextAuthor == author) {
            c = n;
        }
    } else {
        if (prevAuthor == author) {
            a = n;
        }
        if (nextAuthor == author) {
            d = n;
        }
    }

    let nextMessageTime;
    if (i > 0) {
    nextMessageTime = conversationWrapper.currentConversation[i - 1].createdAt.getTime();
    // console.log(conversationWrapper.currentConversation[i - 1].createdAt.getTime() - messageObject.createdAt.getTime());
    } else {nextMessageTime = null}

    if (checkTimestamp(messageObject) > 60000) {
        a = y;
        b = y;
    }
    if ( nextMessageTime - messageObject.createdAt.getTime() > 60000) {
        c = y;
        d = y;
    }

      return [`${a}px ${b}px ${c}px ${d}px`];

    //   return {
    //       color: `red`,
    //   }

}

function checkConversationAds(value) {
    let i = conversationWrapper.currentConversation.indexOf(value);
    return (i % 17 == 0 && i != 0) || i == 5;
    // return i == 5;
}

const options = { year: 'numeric', month: 'long', day: 'numeric' };
function getTimestamp(messageObject) {
    let messageTime = messageObject.createdAt.getTime();
    let messageDay = new Date(messageTime).setHours(0, 0, 0, 0);
    let today = new Date().setHours(0, 0, 0, 0);
    let oneDay = 86400000;
    let time = messageObject.createdAt.toLocaleTimeString(activeLang, { hour: 'numeric', minute: 'numeric' })

    if (messageDay == today) {
        return langJSON[activeLang]["today"] + " " + time;
    } else if(messageDay >= today  - oneDay) {
        return langJSON[activeLang]["yesterday"] + " " + time;
    } else if(messageDay >= today - oneDay * 7) {
        return messageObject.createdAt.toLocaleString(activeLang, {weekday: 'long'}) + " " + time;
    } else if(messageDay >= today - oneDay * 60) {
        return messageObject.createdAt.toLocaleString(activeLang, { month: options.month, day: options.day }) + " " + time;
    } else {
        return messageObject.createdAt.toLocaleString(activeLang, options) + " " + time;
    }
}

function messagePreview(name, message) {
    if (message.sentBy == auth.currentUser.uid) {
        return `Toi : ${message.text}`
    } else {
        return `${name} : ${message.text}`
    }
}