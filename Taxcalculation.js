// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase, ref, set ,orderByChild} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

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
// const auth = getAuth(app); // Initialize Firebase Auth
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

    saveTaxToFirebase(userAdhar, waterTax)

});

// Function to save tax information to Firebase
// Function to save tax information to Firebase
// Function to save tax information to Firebase
function saveTaxToFirebase(adharNumber, taxAmount) {
    const d = new Date();
    let currentMonthIndex = d.getMonth();

    // Reference to the users' data
    var usersRef = ref(database, 'users');

    // Create a query to find the user with the specified adharNumber
    var query = orderByChild(usersRef, 'adhar');
    query = equalTo(query, adharNumber);

    // Retrieve the data
    get(query)
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var userId = childSnapshot.key;

                // Reference to the user's tax data
                var userTaxRef = ref(database, 'users/' + userId + '/waterTax/' + currentMonthIndex);

                // Push the new tax information to the user's tax data
                var newTaxEntry = push(userTaxRef, {
                    currentMonthIndex: currentMonthIndex,
                    taxAmount: taxAmount
                });

                // Display success message or perform any other actions
                console.log("Tax information saved to Firebase for user with adharNumber: " + adharNumber);
                console.log("Tax entry key: " + newTaxEntry.key);
            });
        })
        .catch(function (error) {
            console.error("Error finding user with adharNumber: " + adharNumber, error);
        });
}
