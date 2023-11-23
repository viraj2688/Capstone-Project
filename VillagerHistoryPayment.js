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

// elements form front end
const btnPayment = document.getElementById("PaymentBtn");

function displayUserData(user) { // Function to display user data on the dashboard
  const database = getDatabase();// Get a reference to the database

  const userRef = ref(database, `users/${user.uid}/Transaction/${type_of_tax}`);// Assuming you have a 'users' collection in your database
  // });
  userRef.on('value', (snapshot) => {
    if (snapshot.exists()) {
      const transaction_data = snapshot.val();
      const tableBody = document.getElementById('user-table-body');
      tableBody.innerHTML = ''; // Clear existing table content
  
      for (const data in transaction_data) {
        const user = transaction_data[data];
        const tableRow = document.createElement('ul');
        let paymentStatusDisplay = user.payment === 'paid' ? 'Paid' : `<button onclick="makeTransaction('${user.currentMonthIndex}', ${user.taxAmount})">Pay Now</button>`;

        tableRow.innerHTML = `
          <li>${user.currentMonthIndex}</li>
          <li>${user.taxAmount}</li>
          <li>${paymentStatusDisplay}</li>
        `;
        tableBody.appendChild(tableRow);
      }
    } else {
      console.error('No users found in the database');
    }
  });
}

// Check if a user is signed in
auth.onAuthStateChanged(function (user) {
  if (user) {
    displayUserData(user);// User is signed in
  } else {
    console.log('No user is signed in.');// No user is signed in
  }
});

function makeTransaction(disription,amount) {

  var options = {
      "key": "rzp_test_UOCSpmDWDIAYLg", // Enter the Key ID generated from the Dashboard
      "amount": parseInt(`${amount}`)*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 means 50000 paise or ₹500.
      "currency": "INR",
      "name": "Grampanchayat Devevadi",
      "description": `${disription}`,
      "image": "image/ग्रामपंचायत देववाडी.png",// Replace this with the order_id created using Orders API (https://razorpay.com/docs/api/orders).
      "handler":  function (response){
          savetoDB(response);
          $('#myModal').modal();
      },
      "prefill": {
          "name": `${user_actual_name}`,
          "email": `${user_email}`,
          "contact": `${user_phone_number}`
      },
  }
  var propay = new Razorpay(options);
  propay.open();
};


function savetoDB(response) {
  // console.log(response)
  var payRef = ref(database, `users/uid/Transaction/${type_of_tax}/${date}`);

  payRef.set({
  payment : "paid",
  payment_id : response.razorpay_payment_id
  })
}