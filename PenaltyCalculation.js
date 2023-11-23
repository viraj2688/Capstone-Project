
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

const PeneltyRate = document.getElementById("PeneltyRate");
const DelayedDays = document.getElementById("DelayedDays");
const btnPeneltyCal = document.getElementById("btnPeneltyCal");
const resultElement = document.getElementById("resultPenelty");
const userName = document.getElementById("username");

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();

btnPeneltyCal.addEventListener('click', function (e) {
    e.preventDefault();
    const pnltyRate = parseFloat(PeneltyRate.value);
    const DelyedDays = parseFloat(DelayedDays.value);
    const userAdhar = userName.value;

    // Check if the input values are valid numbers
    if (isNaN(pnltyRate) || isNaN(DelyedDays)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    // Calculate the water tax
    const Penelty = pnltyRate * DelyedDays;

    // Display the result on the HTML page
    resultElement.textContent = "Amount of Tax :  " + Penelty.toFixed(2);

    savePenaltyToFirebase(userAdhar, Penelty );
});

function savePenaltyToFirebase(userName, taxAmount) {
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