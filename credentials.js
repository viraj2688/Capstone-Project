// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi3DAqMDFQiSak9MABrPz1W4r7_kpID2o",
  authDomain: "capstone-project-fa003.firebaseapp.com",
  databaseURL: "https://capstone-project-fa003-default-rtdb.firebaseio.com",
  projectId: "capstone-project-fa003",
  storageBucket: "capstone-project-fa003.appspot.com",
  messagingSenderId: "257374439877",
  appId: "1:257374439877:web:0909d4c9c34c7ffb48a3ac",
  measurementId: "G-X1WGR3RS0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Auth
const database = getDatabase();

const password = document.getElementById("password"); 
const email = document.getElementById("email");
const userName = document.getElementById("username");
const mobileNumber = document.getElementById("MobileNumber");
const btnSubmit = document.getElementById("registerBtn");

btnSubmit.addEventListener('click', function (e) {
  e.preventDefault();

  const valueEmail = email.value;
  const valuePassword = password.value;
  const valueUserName = userName.value;
  const valueNumber = mobileNumber.value;

  if (!validateEmail(valueEmail) || !validatePassword(valuePassword)) {
    alert("Please check email and password.");
    return;
  }
  if (!validateUserName(valueUserName) || !validateMobileNumber(valueNumber)) {
    alert("Please check username or number.");
    return;
  }

  // Firebase Authentication: Create a new user
  createUserWithEmailAndPassword(auth, valueEmail, valuePassword)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

      var databaseRef = ref(database); // Get the root reference

      var user_data = {
        email: valueEmail,
        userName: valueUserName,
        mobileNum: valueNumber,
        lastLogin: Date.now()
      };

      // Set data in the database at a specific path
      set(ref(database, 'users/' + valueUserName), user_data)
        .then(() => {
          alert("User registered successfully!");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
});

function validateEmail(email) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateUserName(userName) {
  // Use a regular expression to check if the userName is a 12-digit number
  var expression = /^\d{12}$/;
  return expression.test(userName);
}

function validateMobileNumber(mobileNumber) {
  // Use a regular expression to check if the mobileNumber is a 10-digit number
  var expression = /^\d{10}$/;
  return expression.test(mobileNumber);
}
