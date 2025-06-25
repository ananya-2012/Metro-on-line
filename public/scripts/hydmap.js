let selectedFrom = null; 
let selectedTo = null; 

document.querySelectorAll('circle').forEach(station => {
    station.addEventListener('click', (event) => {
        const stationName = station.nextElementSibling.textContent;

        if (selectedFrom && selectedTo) {
            alert('Both "From" and "To" are already selected!');
            return;
        }
        if (stationName === selectedFrom) {
            alert('This station is already selected as "From". Choose a different station.');
            return;
        }
        if (stationName === selectedTo) {
            alert('This station is already selected as "To". Choose a different station.');
            return;
        }

        const existingPopup = document.querySelector('.station-popup');
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement('div');
        popup.classList.add('station-popup');

        popup.innerHTML = `
            <p>Select for: <strong>${stationName}</strong></p>
            <button id="fromBtn">From</button>
            <button id="toBtn">To</button>
        `;

        document.body.appendChild(popup);

        const rect = station.getBoundingClientRect();
        popup.style.left = `${rect.left + window.scrollX + 20}px`;
        popup.style.top = `${rect.top + window.scrollY - 30}px`;

     
        document.getElementById('fromBtn').addEventListener('click', () => {
            selectedFrom = stationName;
            alert('Selected "From" station: ' + stationName);
            popup.remove(); 
        });

        document.getElementById('toBtn').addEventListener('click', () => {
            selectedTo = stationName;
            alert('Selected "To" station: ' + stationName);
            popup.remove(); 
        });
    });
});

document.addEventListener('click', (event) => {
    const popup = document.querySelector('.station-popup');
    if (popup && !event.target.closest('.station-popup') && !event.target.closest('circle')) {
        popup.remove();
    }
});