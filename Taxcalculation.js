// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();

const NumberOfConnections = document.getElementById("numbers_of_connections");
const WaterVolume = document.getElementById("volume_of_water_usage");
const WaterRate = document.getElementById("rate_of_water");
const resultElement = document.getElementById("result");
const btnCalculateWaterTax = document.getElementById("btnCalculateWaterTax");
const user_adhar = document.getElementById("user_adhar_for_tax");

btnCalculateWaterTax.addEventListener('click', function (e) {
    const connections = parseFloat(NumberOfConnections.value);
    const volume = parseFloat(WaterVolume.value);
    const rate = parseFloat(WaterRate.value);
    const userAdhar = user_adhar.value;

    // Check if the input values are valid numbers
    if (isNaN(connections) || isNaN(volume) || isNaN(rate)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    // Calculate the water tax
    const waterTax = connections * volume * rate;

    // Display the result on the HTML page
    resultElement.textContent = "Amount of Tax :  " + waterTax.toFixed(2);

    // Assuming 'userAdhar' is the 'userName' in your case
    saveTaxToFirebase(userAdhar, waterTax);
});

// Function to save tax information to Firebase
// function saveTaxToFirebase(userName, taxAmount) {
//     const d = new Date();
//     let currentMonthIndex = d.getMonth() + 1;
//     let currentYear = d.getFullYear();

//     // Reference to the user's tax data
//     var userTaxRef = ref(database, `users/${userName}/waterTax/${currentMonthIndex}-${currentYear}`);

//     // Push the new tax information to the user's tax data
//     set(userTaxRef, {
//         currentMonthIndex: `${currentMonthIndex}.${currentYear}`,
//         taxAmount: taxAmount
//     });

//     // Display success message or perform any other actions
//     console.log("Tax information saved to Firebase for user with userName: " + userName);
// }

// Function to retrieve a user based on userName
function getUserByUserName(userName, callback) {
    var usersRef = ref(database, 'users');

    usersRef.orderByChild('userName').equalTo(userName).once('value')
        .then(function (snapshot) {
            if (snapshot.exists()) {
                // Get the user data
                const userData = snapshot.val();

                // Assuming there's only one user with the specified userName
                const userId = Object.keys(userData)[0];

                // Call the callback function with the user data
                callback(userId, userData[userId]);
            } else {
                // User with the specified userName does not exist
                callback(null);
            }
        })
        .catch(function (error) {
            console.error("Error retrieving user by userName:", error);
            callback(null); // Assume an error occurred
        });
}

btnCalculateWaterTax.addEventListener('click', function (e) {
    const connections = parseFloat(NumberOfConnections.value);
    const volume = parseFloat(WaterVolume.value);
    const rate = parseFloat(WaterRate.value);
    const userAdhar = user_adhar.value;

    // Check if the input values are valid numbers
    if (isNaN(connections) || isNaN(volume) || isNaN(rate)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    // Calculate the water tax
    const waterTax = connections * volume * rate;

    // Retrieve user data by userName
    getUserByUserName(userAdhar, function (userId, userData) {
        if (userId) {
            // Use userId in the path instead of userName
            saveTaxToFirebase(userId, waterTax);
        } else {
            console.log("User not found with userName:", userAdhar);
        }
    });
});

// Function to save tax information to Firebase
function saveTaxToFirebase(userId, taxAmount) {
    const d = new Date();
    let currentMonthIndex = d.getMonth() + 1;
    let currentYear = d.getFullYear();

    // Reference to the user's tax data using userId
    var userTaxRef = ref(database, `users/${userId}/waterTax/${currentMonthIndex}-${currentYear}`);

    // Push the new tax information to the user's tax data
    set(userTaxRef, {
        currentMonthIndex: `${currentMonthIndex}.${currentYear}`,
        taxAmount: taxAmount
    });

    // Display success message or perform any other actions
    console.log("Tax information saved to Firebase for user with userId: " + userId);
}