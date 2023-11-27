// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

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

// Function to display tax and penalty calculations
// function displayCalculations(user, type_of_tax) {
//   const userRef = ref(database, `users/${user.uid}/Transaction/${type_of_tax}`);
//   const list = document.getElementById(type_of_tax);

//   get(userRef).then((snapshot) => {
//     if (snapshot.exists()) {
//       const calculation_data = snapshot.val();

//       // Clear existing content
//       list.innerHTML = '';

//       for (const data in calculation_data) {
//         const calculation = calculation_data[data];
//         const listItem = document.createElement('li');
//         listItem.textContent = `date : ${calculation.currentMonthIndex} paymable amount : ${calculation.taxAmount}`;

//         // Create a button for each entry
//         const printButton = document.createElement('button');
//         printButton.textContent = 'pay';
//         printButton.addEventListener('click', () => {
//           // Print the amount to the console
//           console.log(`Amount for ${type_of_tax}: ${calculation.taxAmount}`);
//         });

//         listItem.appendChild(printButton);

//         // Append to the correct list
//         list.appendChild(listItem);
//       }
//     } else {
//       console.error(`No ${type_of_tax} calculations found in the database`);
//     }
//   });
// }

// Function to display tax and penalty calculations in a table
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

        // Action column (button)
        const actionCell = document.createElement('td');
        const payButton = document.createElement('button');
        payButton.textContent = 'Pay';
        payButton.addEventListener('click', () => {
          // Print the amount to the console or perform other actions
          console.log(`Amount for ${type_of_tax}: ${calculation.taxAmount}`);


          makeTransaction(type_of_tax ,calculation.taxAmount,);

        });
        actionCell.appendChild(payButton);
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


// Check if a user is signed in
auth.onAuthStateChanged(function (user) {
  if (user) {
    // Display tax calculations
    displayCalculations(user, 'waterTax');

    // Display penalty calculations
    displayCalculations(user, 'Penalty');
  } else {
    console.log('No user is signed in.');
  }
});


function makeTransaction(disription, amount) {

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
      savetoDB(response);
      $('#myModal').modal();
    },
    // "prefill": {
    //     "name": `${user_actual_name}`,
    //     "email": `${user_email}`,
    //     "contact": `${user_phone_number}`
    // },
  }
  var propay = new Razorpay(options);
  propay.open();
};


function savetoDB(response, type_of_tax) {
  // console.log(response)
  var payRef = ref(database, `users/uid/Transaction/${type_of_tax}/${date}`);

  payRef.set({
    payment: "paid",
    payment_id: response.razorpay_payment_id
  })
}