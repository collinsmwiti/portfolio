//authentication to firebase
// Initialize Firebase
//subscription purposes
// var apiKey = require('.env').apiKey;
var apiKey = "AIzaSyDANuo3FqG6A_5yEyWAZ0orrgac2cdxaaA";

var config = {
  apiKey: apiKey,
  authDomain: "wedsmart-94244.firebaseapp.com",
  databaseURL: "https://wedsmart-94244.firebaseio.com",
  projectId: "wedsmart-94244",
  storageBucket: "wedsmart-94244.appspot.com",
  messagingSenderId: "882648464588"
};
firebase.initializeApp(config);

// firebase.database().ref().child();
// firebase.auth();
$('#submitButton').click(function(e) {
  e.preventDefault();
  var database = firebase.database().ref().child('wedsmart-94244');
  var newName = $('#name').val();
  var newAge = $('#age').val();
  database.push().set({
    name: newName,
    age: newAge
  });
});


//manage users to sign in
// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in
//
//   } else {
//     // No user is signed in.
//     alert("Please put your email and password");
//   }
// });



//login button
$("#login").submit(function(error) {
  error.preventDefault();
  var email = $("#loginEmail").val();
  var password = $("#loginPassword").val();

  if (email !== "" && password !== "") {

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function() {
        window.location.replace('./vendors.html');
      }).catch(function(error) {
        // $("#loginError").show().text(error.message);
        console.log(error);
      });
  }
});

$('#register').submit(function(event) {
  event.preventDefault();
  var email = $('#signUpEmail').val();
  var password = $('#signUpPassword').val();

  // console.log(email);
  // console.log(password);

  if (!email || !password) {
    return console.log('email and password required');
  }

  // Register user
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function() {
      window.location.replace("./vendors.html");
    })
    .catch(function(error) {
      console.log('register error', error);
    });
});

$('#logout').click(function() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    window.location.replace("./index.html");
    console.log("Signed out");
  }).catch(function(error) {
    console.log(error);
  });
});

firebase.auth().onAuthStateChanged(function(user) {
  // app.user = user;
  console.log('user', user);

  // if (!user) {
  //   window.location.replace("./index.html");
  // }
});
