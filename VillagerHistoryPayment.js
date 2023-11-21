var firebaseConfig = {
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
firebase.initializeApp(firebaseConfig);

// Check if a user is signed in
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.uid);
        // Populate tax and penalty lists with data from Firebase
        populateList('tax', 'taxList', user.uid);
        populateList('penalty', 'penaltyList', user.uid);
    } else {
        // No user is signed in
        console.log('No user is signed in.');
    }
});

// JavaScript function to toggle visibility of a specific compartment
function toggleCompartment(compartment) {
    var compartmentElement = document.querySelector('.compartment.' + compartment);

    if (compartmentElement.style.display === 'block') {
        compartmentElement.style.display = 'none';
    } else {
        compartmentElement.style.display = 'block';
    }
}


// JavaScript function to populate tax or penalty list from Firebase for the current user
function populateList(compartment, listId, userId) {
    var list = document.getElementById(listId);
    var database = firebase.database();
    var dataRef = database.ref('users/' + userId + '/' + compartment);

    dataRef.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var dataItem = childSnapshot.val();
            var listItem = document.createElement('li');
            listItem.textContent = 'Details: ' + dataItem.details + ', Amount: ' + dataItem.amount;
            list.appendChild(listItem);
        });
    });
}