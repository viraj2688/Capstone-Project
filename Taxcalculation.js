// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getDatabase, ref, set, child, get, equalTo, query, orderByChild } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";




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
const userName = document.getElementById("user_adhar_for_tax");


btnCalculateWaterTax.addEventListener('click', function (e) {
    const connections = parseFloat(NumberOfConnections.value);
    const volume = parseFloat(WaterVolume.value);
    const rate = parseFloat(WaterRate.value);
    const userAdhar = userName.value;

    // Check if the input values are valid numbers
    if (isNaN(connections) || isNaN(volume) || isNaN(rate)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    const waterTax = connections * volume * rate; // Calculate the water tax    
    resultElement.textContent = "Amount of Tax :  " + waterTax.toFixed(2); // Display the result on the HTML page


    saveTaxToFirebase(userAdhar, waterTax); // Assuming 'userAdhar' is the 'userName' in your case
});

function saveTaxToFirebase(userName, taxAmount, /*duedate*/) {
    const usersRef = ref(database, 'users');

    return get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userEntry = Object.entries(userData).find(([uid, user]) => user.userName === userName);

            if (userEntry) {
                const [uid, user] = userEntry;
                const d = new Date();
                let currentMonthIndex = d.getMonth() + 1;
                let currentYear = d.getFullYear();
                const userTaxRef = ref(database, `users/${uid}/Transaction/waterTax/${currentMonthIndex}-${currentYear}`);
                set(userTaxRef, {
                    currentMonthIndex: `${currentMonthIndex}.${currentYear}`,
                    taxAmount: taxAmount,
                    // duedate : duedate
                    payment : "unpaid"
                });

            } else {
                console.log(`User with username ${userName} not found.`);
                return null;
            }
        } else {
            console.log('No data found in "users" node.');
            return null;
        }
    }).catch((error) => {
        console.error('Error fetching data:', error);
        return null;
    });
}

