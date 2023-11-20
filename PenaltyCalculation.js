const PeneltyRate = document.getElementById("PeneltyRate");
const DelayedDays = document.getElementById("DelayedDays");
const btnPeneltyCal = document.getElementById("btnPeneltyCal");
const resultElement = document.getElementById("resultPenelty");

btnPeneltyCal.addEventListener('click', function (e) {
    e.preventDefault();
    const pnltyRate = parseFloat(PeneltyRate.value);
    const DelyedDays = parseFloat(DelayedDays.value);

    // Check if the input values are valid numbers
    if (isNaN(pnltyRate) || isNaN(DelyedDays)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    // Calculate the water tax
    const Penelty = pnltyRate * DelyedDays;

    // Display the result on the HTML page
    resultElement.textContent = "Amount of Tax :  " + Penelty.toFixed(2);
});