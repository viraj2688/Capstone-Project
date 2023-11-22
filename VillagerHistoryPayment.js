// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

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

// Function to display user data on the dashboard
function displayUserData(user) {
  // Get a reference to the database
  const database = getDatabase();

  // Assuming you have a 'users' collection in your database
  const userRef = ref(database, 'users/' + user.uid);
  console.log(user.uid);
  // Listen for changes in user data
  onValue(userRef, (snapshot) => {
    const userData = snapshot.val();

    console.log(userData);
    // Display user data on the dashboard
    // const welcomeMessageElement = document.getElementById('welcomeMessage');
    // welcomeMessageElement.textContent = `Welcome, ${userData.userName}! Your email is ${userData.email}.`;
  });
}

// Check if a user is signed in
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in
    displayUserData(user);
  } else {
    // No user is signed in
    console.log('No user is signed in.');
  }
});
