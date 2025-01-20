auth.onAuthStateChanged(user =>{
    if (user) {
        console.log("logged in")
        document.querySelector(".displayNameInput").value = auth.currentUser.displayName;
        document.querySelector(".title").innerText = auth.currentUser.displayName;
        document.querySelector(".emailTitle").innerText = auth.currentUser.email;
        document.querySelector("main").style.display = "block";
        if (auth.currentUser.photoURL) {
            document.querySelector(".big-profile-wrapper img").src = auth.currentUser.photoURL;
            document.querySelector(".small-profile-wrapper img").src = auth.currentUser.photoURL;
        }
        document.querySelector(".change-pp-modal form input").value = auth.currentUser.photoURL;
        document.querySelector(".user-info-form").addEventListener("submit", (e) => {
            e.preventDefault();
            document.querySelector(".submitEdit").style.backgroundColor = "#74aefa";
            firebase.auth().currentUser.updateProfile({
                displayName: document.querySelector(".displayNameInput").value
              }).then(() => {
                document.querySelector(".submitEdit").style.backgroundColor = "#2374e1";
                document.querySelector(".title").innerText = auth.currentUser.displayName;
              }).catch((err) => {
                console.error(err);
              });
        });
        // setInterval(() => {
        //       if (document.querySelector(".displayNameInput").value !== document.querySelector(".title").innerText) {
        //         firebase.auth().currentUser.updateProfile({
        //             displayName: document.querySelector(".displayNameInput").value
        //           }).catch((err) => {
        //             console.error(err);
        //           });
        //         document.querySelector(".title").innerText = auth.currentUser.displayName;
        //         console.log("testing bitch")
        //       }
        // }, 100);
    } else{
        console.log("logged out")
        location.href = "index.html"
    }
});

// document.querySelector(".small-profile-wrapper").addEventListener("mouseover", ()=>{
//     document.querySelector(".small-profile-wrapper p").style.display = "block";
// });
// document.querySelector(".small-profile-wrapper").addEventListener("mouseleave", ()=>{
//     document.querySelector(".small-profile-wrapper p").style.display = "none";
// });

document.querySelector(".imageURLform").addEventListener("submit", (e)=>{
    e.preventDefault();
    document.querySelector(".big-profile-wrapper img").src = "Rolling-1s-200px.svg";
    firebase.auth().currentUser.updateProfile({
        photoURL: document.querySelector(".imageURLform input").value
      }).then(() => {
        document.querySelector(".big-profile-wrapper img").src = auth.currentUser.photoURL
        document.querySelector(".small-profile-wrapper img").src = auth.currentUser.photoURL;
      })

});

document.querySelector(".small-profile-wrapper").addEventListener("click", ()=>{
    document.querySelector(".change-pp-modal-parent").style.display = "block";
});

document.querySelector(".outerWrapper .addDiv").addEventListener("click", ()=>{
    document.querySelector(".change-pp-modal-parent").style.display = "block";
});

document.querySelector(".change-pp-modal-parent").addEventListener("click", (e)=>{
    if (e.target.classList.contains("change-pp-modal-parent")) {
        document.querySelector(".change-pp-modal-parent").style.display = "none";
    }
});

document.querySelector(".signOutButton").addEventListener("click", ()=>{
    localStorage.clear();
    auth.signOut();
});