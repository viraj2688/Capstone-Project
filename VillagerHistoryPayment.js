

// JavaScript function to toggle visibility of a specific compartment
function toggleCompartment(compartment) {
    var compartmentElement = document.querySelector('.compartment.' + compartment);

    if (compartmentElement.style.display === 'block') {
        compartmentElement.style.display = 'none';
    } else {
        compartmentElement.style.display = 'block';
    }
}
