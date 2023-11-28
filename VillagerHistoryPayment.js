// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

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


// Function to display tax and penalty calculations in a table
// function displayCalculations(user, type_of_tax) {

//   const userRef = ref(database, `users/${user.uid}/Transaction/${type_of_tax}`);
//   const table = document.getElementById(type_of_tax);



//   get(userRef).then((snapshot) => {
//     if (snapshot.exists()) {
//       const calculation_data = snapshot.val();

//       // Clear existing content
//       table.innerHTML = '';

//       // Create table headers
//       const headerRow = document.createElement('tr');
//       const dateHeader = document.createElement('th');
//       dateHeader.textContent = 'Date';
//       headerRow.appendChild(dateHeader);
//       const amountHeader = document.createElement('th');
//       amountHeader.textContent = 'Amount Payable';
//       headerRow.appendChild(amountHeader);
//       const actionHeader = document.createElement('th');
//       actionHeader.textContent = 'Action';
//       headerRow.appendChild(actionHeader);
//       table.appendChild(headerRow);

//       // Populate table rows
//       for (const data in calculation_data) {
//         const calculation = calculation_data[data];
//         const row = document.createElement('tr');

//         // Date column
//         const dateCell = document.createElement('td');
//         dateCell.textContent = calculation.currentMonthIndex;
//         row.appendChild(dateCell);

//         // Amount Payable column
//         const amountCell = document.createElement('td');
//         amountCell.textContent = calculation.taxAmount;
//         row.appendChild(amountCell);

//         // Action column (button)
//         const actionCell = document.createElement('td');
//         const payButton = document.createElement('button');
//         payButton.textContent = 'Pay';
//         payButton.addEventListener('click', () => {
//           // Print the amount to the console or perform other actions
//           console.log(`Amount for ${type_of_tax}: ${calculation.taxAmount}`);


//           makeTransaction(type_of_tax, calculation.taxAmount, user,);

//         });
//         actionCell.appendChild(payButton);
//         row.appendChild(actionCell);

//         // Append the row to the table
//         table.appendChild(row);
//       }
//     } else {
//       console.error(`No ${type_of_tax} calculations found in the database`);
//     }
//   });
// }
function displayCalculations(user, type_of_tax) {
  const userRef = ref(database, `users/${user.uid}/Transaction/${type_of_tax}`);
  const table = document.getElementById(type_of_tax);

  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      const calculation_data = snapshot.val();

      // Clear existing content
      table.innerHTML = '';

      // Create table headers
      const headerRow = document.createElement('tr');
      const dateHeader = document.createElement('th');
      dateHeader.textContent = 'Date';
      headerRow.appendChild(dateHeader);
      const amountHeader = document.createElement('th');
      amountHeader.textContent = 'Amount Payable';
      headerRow.appendChild(amountHeader);
      const actionHeader = document.createElement('th');
      actionHeader.textContent = 'Action';
      headerRow.appendChild(actionHeader);
      table.appendChild(headerRow);

      // Populate table rows
      for (const data in calculation_data) {
        const calculation = calculation_data[data];
        const row = document.createElement('tr');

        // Date column
        const dateCell = document.createElement('td');
        dateCell.textContent = calculation.currentMonthIndex;
        row.appendChild(dateCell);

        // Amount Payable column
        const amountCell = document.createElement('td');
        amountCell.textContent = calculation.taxAmount;
        row.appendChild(amountCell);

        // Action column (button or text)
        const actionCell = document.createElement('td');
        if (calculation.payment === 'paid') {
          // If payment is already paid, display a message or different text
          actionCell.textContent = 'Paid';
        } else {
          // If payment is not paid, display the "Pay" button
          const payButton = document.createElement('button');
          payButton.textContent = 'Pay';
          payButton.addEventListener('click', () => {
            console.log(`Amount for ${type_of_tax}: ${calculation.taxAmount}`);
            makeTransaction(type_of_tax, calculation.taxAmount, user);
          });
          actionCell.appendChild(payButton);
        }
        row.appendChild(actionCell);

        // Append the row to the table
        table.appendChild(row);
      }
    } else {
      console.error(`No ${type_of_tax} calculations found in the database`);
    }
  });
}


// Check if a user is signed in
auth.onAuthStateChanged(function (user) {
  if (user) {
    // Display waterTax calculations
    displayCalculations(user, 'waterTax');

    // Display penalty calculations
    displayCalculations(user, 'Penalty');
  } else {
    console.log('No user is signed in.');
  }
});


function makeTransaction(disription, amount, user) {

  var options = {
    "key": "rzp_test_UOCSpmDWDIAYLg", // Enter the Key ID generated from the Dashboard
    "amount": parseInt(`${amount}`) * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 means 50000 paise or ₹500.
    "currency": "INR",
    "name": "Grampanchayat Devevadi",
    "image": {
      src: "image/logo.svg", // Path to your modified SVG file
      width: '10px', // Specify the width
      height: '50px' // Specify the height
    },
    "logo": {
      src: "image/logo.svg", // Path to your modified SVG file
      width: '10px', // Specify the width
      height: '50px' // Specify the height
    },// Replace this with the order_id created using Orders API (https://razorpay.com/docs/api/orders).
    "description": `${disription}`,
    "handler": function (response) {
      savetoDB(response, user, disription, amount);
      $('#myModal').modal();
    },
    "prefill": {
      "name": `${user.userName}`,
      "email": `${user.email}`,
      "contact": `${user.mobileNum}`
    },
  }
  var propay = new Razorpay(options);
  propay.open();
};


function savetoDB(response, user, disription, taxAmount) {
  // console.log(response)
  const d = new Date();
  let currentMonthIndex = d.getMonth() + 1;
  let currentYear = d.getFullYear();
  let date = `${currentMonthIndex}-${currentYear}`

  var payRef = ref(database, `users/${user.uid}/Transaction/${disription}/${date}`);

  set(payRef, {
    currentMonthIndex: `${currentMonthIndex}.${currentYear}`,
    taxAmount: taxAmount,
    payment: "paid",
    payment_id: response.razorpay_payment_id
  })
}