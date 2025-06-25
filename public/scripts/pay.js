const ticketForm = document.getElementById('ticketForm');
const ticketCountInput = document.getElementById('ticketCount');
const paymentMethodSelect = document.getElementById('paymentMethod');
const paymentDetailsDiv = document.getElementById('paymentDetails');
const fareDisplay = document.getElementById('fareDisplay');

// Set ticket price per ticket
const ticketPrice = 50; // Adjust this value as needed

// Update fare dynamically based on ticket count
ticketCountInput.addEventListener('input', function() {
    const ticketCount = parseInt(ticketCountInput.value, 10) || 0;
    const totalFare = ticketCount * ticketPrice;
    fareDisplay.textContent = `₹${totalFare}`;
});

// Dynamically generate payment fields based on selected payment method
paymentMethodSelect.addEventListener('change', function() {
    const paymentMethod = paymentMethodSelect.value;

    // Clear previous payment details input fields
    paymentDetailsDiv.innerHTML = '';

    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
        paymentDetailsDiv.innerHTML = `
            <label for="cardNumber">Card Number:</label>
            <input type="text" id="cardNumber" name="paymentDetails.cardNumber" placeholder="Enter your 16-digit card number" required>
        `;
    } else if (paymentMethod === 'upi') {
        paymentDetailsDiv.innerHTML = `
            <label for="upiId">UPI ID:</label>
            <input type="text" id="upiId" name="paymentDetails.upiId" placeholder="Enter your UPI ID" required>
        `;
    }
});
