

let scale = 1;
let isDragging = false;
let startX, startY;
let offsetX = 0;
let offsetY = 0;
const dragSpeed = 0.4; // Adjust for drag sensitivity
const xBoundary = 2000; // Maximum allowed offset in the X direction
const yBoundary = 2000; // Maximum allowed offset in the Y direction
const minScale = 1; // Prevent zooming out below this scale
const map = document.getElementById('map');

// Center point for zooming
let centerX = 0; // Initialize with default center, can be updated by user
let centerY = 0;

map.style.transition = "transform 0.2s ease-out"; // Smooth transitions

// Function to set custom zoom center
function setZoomCenter(x, y) {
    centerX = x;
    centerY = y;
}

// Zoom functions with center focus adjustment
function zoomIn() {
    const prevScale = scale;
    scale *= 1.2;
    updateOffsetForZoom(prevScale);
    updateMapTransform();
}

function zoomOut() {
    if (scale > minScale) {
        const prevScale = scale;
        scale /= 1.2;
        updateOffsetForZoom(prevScale);
        updateMapTransform();
    }
}

// Update offset to keep zoom center in focus
function updateOffsetForZoom(prevScale) {
    offsetX -= (centerX * (scale - prevScale));
    offsetY -= (centerY * (scale - prevScale));

    // Apply boundaries to keep within limits
    offsetX = Math.max(-xBoundary, Math.min(xBoundary, offsetX));
    offsetY = Math.max(-yBoundary, Math.min(yBoundary, offsetY));
}

// Function to apply transform for scaling and positioning
function updateMapTransform() {
    map.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
}

// Event listeners for zoom buttons
document.getElementById('zoomIn').addEventListener('click', zoomIn);
document.getElementById('zoomOut').addEventListener('click', zoomOut);

// Function to start dragging
function startDragging(e) {
    if (e.button === 0) { // Left mouse button
        isDragging = true;
        map.style.transition = ""; // Disable transition during dragging
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault();
    }
}

// Function to stop dragging
function stopDragging() {
    isDragging = false;
    map.style.transition = "transform 0.2s ease-out"; // Re-enable transition
}

// Drag function with boundary control
function dragMap(e) {
    if (isDragging) {
        const deltaX = (e.clientX - startX) * dragSpeed;
        const deltaY = (e.clientY - startY) * dragSpeed;

        // Update offsets with boundary limits
        offsetX = Math.max(-xBoundary, Math.min(xBoundary, offsetX + deltaX));
        offsetY = Math.max(-yBoundary, Math.min(yBoundary, offsetY + deltaY));

        // Update startX and startY for smooth continuous dragging
        startX = e.clientX;
        startY = e.clientY;

        updateMapTransform();
    }
}

// Initialize dragging listeners
map.addEventListener('mousedown', startDragging);
document.addEventListener('mouseup', stopDragging);
document.addEventListener('mousemove', dragMap);

// Example usage: Set custom center point

setZoomCenter(80, 1); // Change coordinates to set your desired zoom center












let selectedFrom = null;
let selectedTo = null;
let selectedFromId = null; // Variable to store the "From" station ID
let selectedToId = null; // Variable to store the "To" station ID

// Function to show the "From" flag
function showFromFlag(stationId) {
    hideAllFlags(); // Hide all flags before showing the selected one
    const fromFlag = document.querySelector(`#${stationId}fromFlag`);
    if (fromFlag) {
        fromFlag.parentNode.style.display = 'block'; // Show the specific "From" flag
    }
}

// Function to show the "To" flag
function showToFlag(stationId) {
    // Hide the previous "To" flag if it's already set
    if (selectedTo !== null) {
        const previousToFlag = document.querySelector(`#${selectedToId}toFlag`);
        if (previousToFlag) {
            previousToFlag.parentNode.style.display = 'none'; // Hide the previous "To" flag
        }
    }

    // Set the new "To" flag
    const toFlag = document.querySelector(`#${stationId}toFlag`);
    if (toFlag) {
        toFlag.parentNode.style.display = 'block'; // Show the new "To" flag
    }

    // Update the selected "To" station to the newly clicked station
    selectedTo = stationId;
    selectedToId = stationId; // Save the new "To" station ID
}

// Function to hide all flags
function hideAllFlags() {
    document.querySelectorAll('.fromFlags > foreignObject, .toFlags > foreignObject').forEach(flag => {
        flag.style.display = 'none'; // Hide all flags
    });
}

// Function to reset "From" selection
function resetFromSelection() {
    const fromFlag = document.querySelector(`#${selectedFromId}fromFlag`);
    if (fromFlag) {
        fromFlag.parentNode.style.display = 'none'; // Hide the "From" flag
    }
    selectedFrom = null; // Reset the selected "From" station
    selectedFromId = null; // Reset the saved "From" station ID
    hideAllFlags(); // Ensure all flags are hidden
}

// Function to reset "To" selection
function resetToSelection() {
    const toFlag = document.querySelector(`#${selectedToId}toFlag`);
    if (toFlag) {
        toFlag.parentNode.style.display = 'none'; // Hide the "To" flag
    }
    selectedTo = null; // Reset the selected "To" station
    selectedToId = null; // Reset the saved "To" station ID
}

function getStationNameById(stationId) {
    for (const line of lines) {
        const station = line.stations.find(s => s.id === stationId);
        if (station) {
            return station.name; // Return the station name if found
        }
    }
    return null; // Return null if not found
}

document.addEventListener("DOMContentLoaded", function () {
    // Initially hide all flags
    hideAllFlags();

    const stations = document.querySelectorAll('.station, .interchange, .transferStation');
    stations.forEach(station => {
        station.addEventListener('click', () => {
            const stationId = station.parentNode.id; // Get the ID of the clicked station
            const stationName = getStationNameById(stationId); // Retrieve station name by ID

            // Logic for handling "From" selection
            if (selectedFrom === null) {
                // No "From" selected, set current station as "From"
                selectedFrom = stationName; // Set the new "From" station name
                selectedFromId = stationId; // Save the "From" station ID for future use
                document.getElementById("startSearch").value = stationName; // Update "From" input with station name
                showFromFlag(stationId); // Show the "From" flag
            } else if (selectedFrom === stationName) {
                // Clicking the same "From" station, reset the selection
                resetFromSelection();
            } else if (selectedTo === null) {
                // If a "From" is selected and no "To" selected, set current station as "To"
                selectedTo = stationName; // Set the new "To" station
                selectedToId = stationId; // Save the "To" station ID for future use
                document.getElementById("endSearch").value = stationName; // Update "To" input with station name
                showToFlag(stationId); // Show the "To" flag
            } else if (selectedTo === stationName) {
                // Clicking the same "To" station, reset the selection
                resetToSelection();
            } else {
                // If both are selected and a different station is clicked
                resetToSelection(); // Hide the previous "To" flag
                selectedTo = stationName; // Set the new "To" station
                selectedToId = stationId; // Update the "To" station ID for future use
                document.getElementById("endSearch").value = stationName; // Update "To" input with station name
                showToFlag(stationId); // Show the new "To" flag
            }
        });
    });

    populateDropdowns(); // Initialize dropdown with lines on page load
});

// Function to interchange stations
function interchangeStations() {
    // Get references to the input fields
    const startSearch = document.getElementById('startSearch');
    const endSearch = document.getElementById('endSearch');

    // Temporarily store the values and IDs for swapping
    const tempStationName = startSearch.value;  // Name of the "From" station
    const tempStationId = selectedFromId;        // ID of the "From" station

    // Swap the values
    startSearch.value = endSearch.value;          // Set "From" to the current "To" value
    endSearch.value = tempStationName;            // Set "To" to the original "From" value

    // Update the selected variables
    const tempSelectedFrom = selectedFrom;        // Store the original "From" selection
    const tempSelectedTo = selectedTo;            // Store the original "To" selection

    selectedFrom = selectedTo;                    // Update "From" to the current "To"
    selectedTo = tempSelectedFrom;                // Update "To" to the original "From"

    // Update IDs as well
    const tempSelectedFromId = selectedFromId;    // Store the original "From" ID
    selectedFromId = selectedToId;                // Update "From" ID to the current "To" ID
    selectedToId = tempSelectedFromId;            // Update "To" ID to the original "From" ID

    // Hide all flags and show the updated flags
    hideAllFlags();                                // Hide all flags first
    showFromFlag(selectedFromId);                  // Show the flag for the new "From"
    showToFlag(selectedToId);                      // Show the flag for the new "To"
}

// Event listener for the interchange button
document.getElementById('interchangeBtn').addEventListener('click', interchangeStations);


// Function to populate the dropdowns with train lines for both From and To
function populateDropdowns() {
    populateDropdown('startOptions', 'startSearch', 'From');
    populateDropdown('endOptions', 'endSearch', 'To');
}

// Function to populate a specific dropdown
function populateDropdown(dropdownId, searchInputId, label) {
    const dropdownContainer = document.getElementById(dropdownId);
    dropdownContainer.innerHTML = ''; // Clear previous options

    lines.forEach((line, index) => {
        const lineDiv = document.createElement("div");
        lineDiv.className = `${line.color} line-item`;
        lineDiv.textContent = line.name;
        lineDiv.dataset.index = index;
        lineDiv.onclick = (event) => {
            event.stopPropagation(); // Prevent closing the dropdown when clicking on an option
            openPopup(line.stations, line.name, line.color, label);
        };
        dropdownContainer.appendChild(lineDiv);
    });
}


// Initialize dropdowns on page load
document.addEventListener("DOMContentLoaded", () => {
    populateDropdowns(); // Call the refactored function to populate both dropdowns
});

// Show dropdown when input is focused
function showDropdown() {
    document.getElementById("startOptions").classList.add("show");
}




// Close dropdown and popup when clicking outside
document.addEventListener("click", function (event) {
    const dropdownFrom = document.getElementById("startOptions");
    const searchInputFrom = document.getElementById("startSearch");
    const popupFrom = document.getElementById("dataPopup");

    const dropdownTo = document.getElementById("endOptions");
    const searchInputTo = document.getElementById("endSearch");
    const popupTo = document.getElementById("dataPopupTo");

    // Check if the click was outside the From dropdown, popup, and the search input
    if (!dropdownFrom.contains(event.target) && !popupFrom.contains(event.target) && event.target !== searchInputFrom) {
        dropdownFrom.classList.remove("show"); // Close From dropdown
        closePopup(); // Close From popup
    }

    // Check if the click was outside the To dropdown, popup, and the search input
    if (!dropdownTo.contains(event.target) && !popupTo.contains(event.target) && event.target !== searchInputTo) {
        dropdownTo.classList.remove("show"); // Close To dropdown
        closeToPopup(); // Close To popup
    }
});


// Close popup
function closePopup() {
    document.getElementById("dataPopup").style.display = "none";
}

function closeToPopup() {
    document.getElementById("dataPopup").style.display = "none";
}

// Function to show the "To" dropdown
function showToDropdown() {
    document.getElementById("endOptions").classList.add("show");
}


// Close "To" popup
function closeToPopup() {
    const popup = document.getElementById("dataPopupTo");
    if (popup) {
        popup.style.display = "none"; // Hide the popup
    }
}


// Close dropdown and popup when clicking outside
document.addEventListener("click", function (event) {
    const dropdownTo = document.getElementById("endOptions");
    const searchInputTo = document.getElementById("endSearch");
    const popupTo = document.getElementById("dataPopupTo");

    // Check if the click was outside the dropdown, popup, and the search input
    if (!dropdownTo.contains(event.target) && !popupTo.contains(event.target) && event.target !== searchInputTo) {
        dropdownTo.classList.remove("show"); // Close "To" dropdown
        closeToPopup(); // Close "To" popup
    }
});




// Function to open the station popup for both From and To


// Close popup
function closePopup() {
    document.getElementById("dataPopup").style.display = "none";
    document.getElementById("dataPopupTo").style.display = "none";
}

// Close popup
function closePopup() {
    const popup = document.getElementById("dataPopup");
    if (popup) {
        popup.style.display = "none"; // Hide the From popup
    }
    const popupTo = document.getElementById("dataPopupTo");
    if (popupTo) {
        popupTo.style.display = "none"; // Hide the To popup
    }
}

// Close dropdown and popup when clicking outside
document.addEventListener("click", function (event) {
    const dropdownFrom = document.getElementById("startOptions");
    const searchInputFrom = document.getElementById("startSearch");
    const popupFrom = document.getElementById("dataPopup");

    const dropdownTo = document.getElementById("endOptions");
    const searchInputTo = document.getElementById("endSearch");
    const popupTo = document.getElementById("dataPopupTo");

    // New container for the search popup
    const searchPopupContainer = document.querySelector('.search-popup-container');

    // Check if the click was outside the From dropdown, popup, and the search input
    if (!dropdownFrom.contains(event.target) && !popupFrom.contains(event.target) && event.target !== searchInputFrom && !searchPopupContainer.contains(event.target)) {
        dropdownFrom.classList.remove("show"); // Close From dropdown
        closePopup(); // Close From popup
    }

    // Check if the click was outside the To dropdown, popup, and the search input
    if (!dropdownTo.contains(event.target) && !popupTo.contains(event.target) && event.target !== searchInputTo && !searchPopupContainer.contains(event.target)) {
        dropdownTo.classList.remove("show"); // Close To dropdown
        closePopup(); // Close To popup
    }
});

document.getElementById("bookTicketButton").addEventListener("click", () => {
    const from = document.getElementById("startSearch").value; // Get 'From' station
    const to = document.getElementById("endSearch").value;     // Get 'To' station
    const journeyDate = document.getElementById("journey-date").value; // Get journey date
    const journeyTime = document.getElementById("journey-time").value; // Get journey time

    // Validate inputs
    if (!from || !to || !journeyDate || !journeyTime) {
        alert("Please fill all fields before booking the ticket!");
        return;
    }

    // Redirect to the pay page with query parameters
    const journeyDateTime = `${journeyDate} ${journeyTime}`;
    const queryString = `?customerId=12345&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&journeyDateTime=${encodeURIComponent(journeyDateTime)}`;
    window.location.href = `/pay${queryString}`;
});



// Function to reset all data, including flags, date, and time
function resetAll() {
    // Clear input fields for "From" and "To"
    document.getElementById("startSearch").value = '';
    document.getElementById("endSearch").value = '';

    // Clear date and time fields
    document.getElementById("journey-date").value = '';
    document.getElementById("journey-time").value = '';

    // Reset selected station variables
    selectedFrom = null;
    selectedFromId = null;
    selectedTo = null;
    selectedToId = null;

    // Clear the route and fare table if it exists
    const routeTable = document.getElementById("routeTable"); // Assuming table ID is 'routeTable'
    if (routeTable) {
        routeTable.innerHTML = ''; // Clear table content
    }

    hideAllFlags();

    // Close any open dropdowns and popups
    closePopup();
    document.getElementById("startOptions").classList.remove("show");
    document.getElementById("endOptions").classList.remove("show");


}


// Attach the reset function to the Reset button
document.querySelector(".reset-button").addEventListener("click", resetAll);


function filterStations(type) {
    const searchInput = document.getElementById(`${type}Search`);

    // Detect when the "Backspace" key is pressed
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace') {
            searchInput.value = ''; // Clear the entire input field
            event.preventDefault(); // Prevent default backspace behavior
            filterStations(type); // Update the dropdown to show all options
        }
    });

    const filter = searchInput.value.toUpperCase();
    const options = document.querySelectorAll(`#${type}Options div`);

    options.forEach(option => {
        const textValue = option.textContent || option.innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            option.style.display = ''; // Show option if it matches the filter
        } else {
            option.style.display = 'none'; // Hide option if it doesn't match the filter
        }
    });
}

function filterpopupStations() {
    const searchInput = document.getElementById('popupInput'); // Get the search input
    const filter = searchInput.value.toUpperCase(); // Get the filter text in uppercase
    const options = document.querySelectorAll('#popupStationList li'); // Get all list items

    // Filter the list based on the input value
    options.forEach(option => {
        const textValue = option.textContent || option.innerText; // Get text content
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            option.style.display = ''; // Show matching option
        } else {
            option.style.display = 'none'; // Hide non-matching option
        }
    });
}

// Close popup and reset input field when clicking outside
document.addEventListener("click", function (event) {
    const dropdown = document.getElementById("dataPopup");
    const searchInput = document.getElementById("popupInput");

    // Check if the click was outside the dropdown and input field
    if (!dropdown.contains(event.target) && event.target !== searchInput) {
        closePopup(); // Close the popup
        searchInput.value = ''; // Clear the input field
        filterpopupStations(); // Reset filtering
    }
});

document.getElementById('popupInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default action on Enter key
    }
});

function openPopup(stations, lineName, lineColor, label) {
    const popup = document.getElementById(label === 'From' ? "dataPopup" : "dataPopupTo");
    const popupList = document.getElementById(label === 'From' ? "popupStationList" : "popupStationListTo");

    // Set popup header color based on line color
    popup.className = `data-popup ${lineColor}`;
    popupList.innerHTML = ''; // Clear previous stations

    // Filter out the selected "From" station in the "To" list
    const filteredStations = (label === 'To' && selectedFromId !== null)
        ? stations.filter(station => station.id !== selectedFromId)
        : stations;

    filteredStations.forEach((station, index) => {
        const stationItem = document.createElement("li");
        stationItem.className = `${lineColor} station-item`;
        stationItem.innerHTML = `
            <div class="sub-result-left"><i class="circle">${index + 1}</i></div>
            <div class="sub-result-right">
                <div class="sub-result-name">${station.name}</div>
            </div>`;

        // Add click event to set the "From" or "To" field and close popup
        stationItem.onclick = () => {
            if (label === 'From') {
                document.getElementById("startSearch").value = station.name; // Set the "From" field
                showFromFlag(station.id); // Show the "From" flag on the map
                selectedFrom = station.name; // Update the selected "From" station
                selectedFromId = station.id; // Save the "From" station ID
            } else {
                document.getElementById("endSearch").value = station.name; // Set the "To" field
                showToFlag(station.id); // Show the "To" flag on the map
                selectedTo = station.name; // Update the selected "To" station
                selectedToId = station.id; // Save the "To" station ID
            }
            closePopup(); // Close popup for both
            document.getElementById(label === 'From' ? "startOptions" : "endOptions").classList.remove("show"); // Close dropdown
        };

        popupList.appendChild(stationItem);
    });

    popup.style.display = "block"; // Show the popup
}




const lines = [
    {
        name: "Red Line",
        color: "red",
        stations: [
            { name: "Rohini West", id: "RHW" },
            { name: "Rohini East", id: "RHE" },
            { name: "Pitampura", id: "PTP" },
            { name: "Kohat Enclave", id: "KE" },
            { name: "Keshav Puram", id: "KP" },
            { name: "Kanhaiya Nagar", id: "KN" },
            { name: "Shastri Nagar", id: "SHT" },
            { name: "Pratap Nagar", id: "PRA" },
            { name: "Pulbangash", id: "PBGH" },
            { name: "Tis Hazari", id: "TZI" },
            { name: "Shastri Park", id: "SHPK" },
            { name: "Seelampur", id: "SLAP" },
            { name: "Shahdara", id: "SHD" },
            { name: "Mansarovar Park", id: "MPK" },
            { name: "Jhilmil", id: "JLML" },
            { name: "Dilshad Garden", id: "DSG" },
            { name: "Shaheed Nagar", id: "SHDN" },
            { name: "Raj Bagh", id: "RJBH" },
            { name: "Major Mohit Sharma", id: "RJNM" },
            { name: "Shyam Park", id: "SMPK" },
            { name: "Mohan Nagar", id: "MNGM" },
            { name: "Arthala", id: "ATHA" },
            { name: "Hindon River", id: "HDNR" },
        ]
    },
    {
        name: "Yellow Line",
        color: "yellow",
        stations: [
            { name: "Rohini Sector", id: "RISE" },
            { name: "Haiderpur Badli Mor", id: "BIMR" },
            { name: "JahangirPuri", id: "JGPI" },
            { name: "Adarsh Nagar", id: "AHNR" },
            { name: "Model Town", id: "MDTW" },
            { name: "Guru Teg Bahadur", id: "GTBR" },
            { name: "Vishwavidyalaya", id: "VW" },
            { name: "Vidhan Sabha", id: "VS" },
            { name: "Civil Lines", id: "CL" },
            { name: "Chandni Chowk", id: "CHK" },
            { name: "Chawri Bazar", id: "CWBR" },
            { name: "Patel Chowk", id: "PTCK" },
            { name: "Udyog Bhawan", id: "UDB" },
            { name: "Lok Kalyan Marg", id: "LKM" },
            { name: "Jor Bagh", id: "JB" },
            { name: "AIIMS", id: "AIIMS" },
            { name: "Green Park", id: "GNPK" },
            { name: "Malviya Nagar", id: "MVNR" },
            { name: "Saket", id: "SAKT" },
            { name: "Qutab Minar", id: "QM" },
            { name: "Chhatarpur", id: "CHTP" },
            { name: "Sultanpur", id: "SLTP" },
            { name: "Ghitorni", id: "GTNI" },
            { name: "Arjan Garh", id: "AJG" },
            { name: "Guru Dronacharya", id: "GE" },
            { name: "M.G. Road", id: "MGRO" },
            { name: "IFFCO Chowk", id: "IFOC" },
        ]
    },
    {
        name: "Dark green Line",
        color: "Dgreen",
        stations: [
            { name: "Dwarka Sector - 8", id: "DSET" },
            { name: "Dwarka Sector - 9", id: "DSN" },
            { name: "Dwarka Sector - 10", id: "DST" },
            { name: "Dwarka Sector - 11", id: "DSE" },
            { name: "Dwarka Sector - 12", id: "DSW" },
            { name: "Dwarka Sector - 13", id: "DSTN" },
            { name: "Dwarka Sector - 14", id: "DSFN" },
            { name: "Dwarka Mor", id: "DM" },
            { name: "Nawada", id: "NWD" },
            { name: "Uttam Nagar West", id: "UNW" },
            { name: "Uttam Nagar East", id: "UNE" },
            { name: "Janakpuri East", id: "JPE" },
            { name: "Tilak Nagar", id: "TN" },
            { name: "Subhash Nagar", id: "SN" },
            { name: "Tagore Garden", id: "TG" },
            { name: "Ramesh Nagar", id: "RN" },
            { name: "Moti Nagar", id: "MN" },
            { name: "Shadipur", id: "SP" },
            { name: "Patel Nagar", id: "PN" },
            { name: "Rajendra Place", id: "RP" },
            { name: "Karol Bagh", id: "KB" },
            { name: "Jhandewalan", id: "JW" },
            { name: "Ramakrishna Ashram", id: "RKAM" },
            { name: "Barakhamba Road", id: "BRKR" },
            { name: "Supreme Court", id: "PTMD" },
            { name: "Indraprastha", id: "IDPT" },
            { name: "Akshardham", id: "ASDM" },
            { name: "Mayur Vihar", id: "MVE" },
            { name: "New Ashok Nagar", id: "NAGR" },
            { name: "Noida Sec-15", id: "NSFT" },
            { name: "Noida Sec-16", id: "NSST" },
            { name: "Noida Sec-18", id: "NSET" },
            { name: "Golf Course", id: "GEC" },
            { name: "Noida City Centre", id: "NCC" },
            { name: "Sector-34 Noida", id: "STFN" },
            { name: "Sec-52 Noida", id: "SFTN" },
            { name: "Sec-61 Noida", id: "SSON" },
            { name: "Sec-59 Noida", id: "SFNN" },
            { name: "Sec-62 Noida", id: "SSTN" },
            { name: "Laxmi Nagar", id: "LN" },
            { name: "Nirman Vihar", id: "NV" },
            { name: "Preet Vihar", id: "PTVR" },
            { name: "Kaushambi", id: "KSHI" },

        ]
    },
    {
        name: "Green Line",
        color: "green",
        stations: [
            { name: "Bahadurgarh City", id: "BUSS" },
            { name: "Pandit Shree Ram", id: "MIEE" },
            { name: "Tikri Border", id: "TKBR" },
            { name: "Tikri Kalan", id: "TKLM" },
            { name: "Ghevra Metro Station", id: "GHEM" },
            { name: "Mundka Industrial", id: "MIAA" },
            { name: "Mundka", id: "MUDK" },
            { name: "Rajdhani Park", id: "RDPK" },
            { name: "Nangloi Railway", id: "NRSN" },
            { name: "Nangloi", id: "NNOI" },
            { name: "Maharaja Surajmal", id: "SMSM" },
            { name: "Udyog Nagar", id: "UNRG" },
            { name: "Peeragarhi", id: "PAGI" },
            { name: "Paschim Vihar West", id: "PVW" },
            { name: "Paschim Vihar East", id: "PVE" },
            { name: "Madipur", id: "MAPR" },
            { name: "Shivaji Park", id: "SHVP" },
            { name: "Punjabi Bagh", id: "PBGA" },
            { name: "Ashok Park Main", id: "APMN" },
            { name: "Satguru Ram Singh", id: "SRSM" },
        ]
    },
    {
        name: "Dark red Line",
        color: "Dred",
        stations: [
            { name: "Lal Quila", id: "LLQA" },
            { name: "Jama Masjid", id: "JAMD" },
            { name: "Delhi Gate", id: "DLIG" },
            { name: "ITO", id: "ITO" },
            { name: "Janpath", id: "JNPH" },
            { name: "Khan Market", id: "KM" },
            { name: "JLN Stadium", id: "JLNS" },
            { name: "Jangpura", id: "JGPA" },
            { name: "Moolchand", id: "MLCD" },
            { name: "Kailash Colony", id: "KHCY" },
            { name: "Nehru Place", id: "NP" },
            { name: "Govind Puri", id: "GDPI" },
            { name: "Harkesh Nagar Okhla", id: "HNOK" },
            { name: "Jasola Apollo", id: "JLA" },
            { name: "Sarita Vihar", id: "STVR" },
            { name: "Mohan Estate", id: "METE" },
            { name: "Tughlakabad Station", id: "TKDS" },
            { name: "Badarpur Border", id: "BAPB" },
            { name: "Sarai", id: "SRAI" },
            { name: "NHPC Chowk", id: "NHPC" },
            { name: "Mewala Maharajpur", id: "MMJR" },
            { name: "Sector-28", id: "STTA" },
            { name: "Badkal Mor", id: "BKMR" },
            { name: "Old Faridabad", id: "OFDB" },
            { name: "Neelam Chowk Ajronda", id: "NCAJ" },
            { name: "Bata Chowk", id: "BACH" },
            { name: "Ecorts Mujesar", id: "ECMJ" },
            { name: "Sant Surdas (Sihi)", id: "NCBC" },
        ]
    },
    {
        name: "pink Line",
        color: "pink",
        stations: [
            { name: "Shalimar Bagh", id: "SMBG" },
            { name: "Shakurpur", id: "SAKP" },
            { name: "ESI-Basaidarapur", id: "ESIH" },
            { name: "Mayapuri", id: "MYPI" },
            { name: "Naraina Vihar", id: "NAVR" },
            { name: "Delhi Cantt", id: "DLIC" },
            { name: "Durgabai Deshmukh", id: "DDSC" },
            { name: "Sir M.", id: "SVMB" },
            { name: "Bhikaji Cama Place", id: "BKCP" },
            { name: "Sarojini Nagar", id: "SOJI" },
            { name: "South Extention", id: "SOEN" },
            { name: "Vinobapuri", id: "VNPR" },
            { name: "Ashram", id: "AHRM" },
            { name: "Sarai Kale Khan", id: "NIZM" },
            { name: "Mayur Vihar Pocket-1", id: "MVPO" },
            { name: "Trilokpuri-Sanjay", id: "TKPR" },
            { name: "East Vinod Nagar-", id: "VENT" },
            { name: "Mandawali West Vinod", id: "VNNR" },
            { name: "IP Extension", id: "IPE" },
            { name: "Karkarduma Court", id: "KKDC" },
            { name: "Krishna Nagar", id: "KHNA" },
            { name: "East Azad Nagar", id: "EANR" },
            { name: "Jafrabad", id: "JFRB" },
            { name: "Maujpur-Babarpur", id: "MUPR" },
            { name: "Gokulpuri", id: "GKPR" },
            { name: "Johri Enclave", id: "JIEE" },
        ]
    },
    {
        name: "Magentha Line",
        color: "orange",
        stations: [
            { name: "Dabri Mor- Janakpuri", id: "DBMR" },
            { name: "Dashrathpuri", id: "DSHP" },
            { name: "Palam", id: "PALM" },
            { name: "Sadar Bazar", id: "SABR" },
            { name: "Terminal-1 IGI", id: "IGDA" },
            { name: "Shankar Vihar", id: "SKVR" },
            { name: "Vasant Vihar", id: "VTVR" },
            { name: "Munirka", id: "MIRK" },
            { name: "R K Puram", id: "RKPM" },
            { name: "IIT", id: "IIT" },
            { name: "Panchsheel Park", id: "PSPK" },
            { name: "Chirag Delhi", id: "CDLI" },
            { name: "Greater Kailash", id: "GKEI" },
            { name: "Nehru Enclave", id: "NUEE" },
            { name: "Okhla NSIC", id: "OKNS" },
            { name: "Sukhdev Vihar", id: "IWNR" },
            { name: "Jamia Millia Islamia", id: "JANR" },
            { name: "Okhla Vihar", id: "OVA" },
            { name: "Jasola Vihar Shaheen", id: "JLA8" },
            { name: "Kalindi Kunj", id: "KIKJ" },
            { name: "Okhla Bird Sanctuary", id: "OKBS" }
        ]
    },
    {
        name: "lime Line",
        color: "c1",
        stations: [
            { name: "Nangli", id: "NNGI" },
            { name: "Najafgarh", id: "NFGH" }
        ]
    },
    {
        name: "orange Line",
        color: "c2",
        stations: [
            { name: "Shivaji Stadium", id: "SJSU" },
            { name: "Delhi Aerocity", id: "DACY" },
            { name: "Airport(T-3)", id: "APOT" }
        ]
    },
    {
        name: "Dark Blue Line",
        color: "c3",
        stations: [
            { name: "Belvedere Towers", id: "BEL" },
            { name: "Cyber City", id: "GAT" },
            { name: "Moulsari Avenue", id: "MAL" },
            { name: "Phase-3", id: "DL3" },
            { name: "Phase-1", id: "PH1" },
            { name: "Sector 42-43", id: "SUL" },
            { name: "Sector 53-54", id: "S53" },
            { name: "Sector 54 Chowk", id: "AIT" },
        ]
    },



];


const connections = {
    "RHW": ['RHE'],
    "RHE": ['RHW', 'PTP'],
    "PTP": ['RHE', 'KE'],
    "KE": ['PTP', 'KP'],
    "KP": ['KE', 'KN'],
    "KN": ['KP', 'SHT'],
    "SHT": ['KN', 'PRA'],
    "PRA": ['SHT', 'PBGH'],
    "PBGH": ['PRA', 'TZI'],
    "TZI": ['PBGH', 'SHPK'],
    "SHPK": ['TZI', 'SLAP'],
    "SLAP": ['SHPK', 'SHD'],
    "SHD": ['SLAP', 'MPK'],
    "MPK": ['SHD', 'JLML'],
    "JLML": ['MPK', 'DSG'],
    "DSG": ['JLML', 'SHDN'],
    "SHDN": ['DSG', 'RJBH'],
    "RJBH": ['SHDN', 'RJNM'],
    "RJNM": ['RJBH', 'SMPK'],
    "SMPK": ['RJNM', 'MNGM'],
    "MNGM": ['SMPK', 'ATHA'],
    "ATHA": ['MNGM', 'HDNR'],
    "HDNR": ['ATHA'],
    "RISE": ['BIMR'],
    "BIMR": ['RISE', 'JGPI'],
    "JGPI": ['BIMR', 'AHNR'],
    "AHNR": ['JGPI', 'MDTW'],
    "MDTW": ['AHNR', 'GTBR'],
    "GTBR": ['MDTW', 'VW'],
    "VW": ['GTBR', 'VS'],
    "VS": ['VW', 'CL'],
    "CL": ['VS', 'CHK'],
    "CHK": ['CL', 'CWBR'],
    "CWBR": ['CHK', 'PTCK'],
    "PTCK": ['CWBR', 'UDB'],
    "UDB": ['PTCK', 'LKM'],
    "LKM": ['UDB', 'JB'],
    "JB": ['LKM', 'AIIMS'],
    "AIIMS": ['JB', 'GNPK'],
    "GNPK": ['AIIMS', 'MVNR'],
    "MVNR": ['GNPK', 'SAKT'],
    "SAKT": ['MVNR', 'QM'],
    "QM": ['SAKT', 'CHTP'],
    "CHTP": ['QM', 'SLTP'],
    "SLTP": ['CHTP', 'GTNI'],
    "GTNI": ['SLTP', 'AJG'],
    "AJG": ['GTNI', 'GE'],
    "GE": ['AJG', 'MGRO'],
    "MGRO": ['GE', 'IFOC'],
    "IFOC": ['MGRO'],
    "DSET": ['DSN'],
    "DSN": ['DSET', 'DST'],
    "DST": ['DSN', 'DSE'],
    "DSE": ['DST', 'DSW'],
    "DSW": ['DSE', 'DSTN'],
    "DSTN": ['DSW', 'DSFN'],
    "DSFN": ['DSTN', 'DM'],
    "DM": ['DSFN', 'NWD'],
    "NWD": ['DM', 'UNW'],
    "UNW": ['NWD', 'UNE'],
    "UNE": ['UNW', 'JPE'],
    "JPE": ['UNE', 'TN'],
    "TN": ['JPE', 'SN'],
    "SN": ['TN', 'TG'],
    "TG": ['SN', 'RN'],
    "RN": ['TG', 'MN'],
    "MN": ['RN', 'SP'],
    "SP": ['MN', 'PN'],
    "PN": ['SP', 'RP'],
    "RP": ['PN', 'KB'],
    "KB": ['RP', 'JW'],
    "JW": ['KB', 'RKAM'],
    "RKAM": ['JW', 'BRKR'],
    "BRKR": ['RKAM', 'PTMD'],
    "PTMD": ['BRKR', 'IDPT'],
    "IDPT": ['PTMD', 'ASDM'],
    "ASDM": ['IDPT', 'MVE'],
    "MVE": ['ASDM', 'NAGR'],
    "NAGR": ['MVE', 'NSFT'],
    "NSFT": ['NAGR', 'NSST'],
    "NSST": ['NSFT', 'NSET'],
    "NSET": ['NSST', 'GEC'],
    "GEC": ['NSET', 'NCC'],
    "NCC": ['GEC', 'STFN'],
    "STFN": ['NCC', 'SFTN'],
    "SFTN": ['STFN', 'SSON'],
    "SSON": ['SFTN', 'SFNN'],
    "SFNN": ['SSON', 'SSTN'],
    "SSTN": ['SFNN', 'LN'],
    "LN": ['SSTN', 'NV'],
    "NV": ['LN', 'PTVR'],
    "PTVR": ['NV', 'KSHI'],
    "KSHI": ['PTVR'], "BUSS": ['MIEE'],
    "MIEE": ['BUSS', 'TKBR'],
    "TKBR": ['MIEE', 'TKLM'],
    "TKLM": ['TKBR', 'GHEM'],
    "GHEM": ['TKLM', 'MIAA'],
    "MIAA": ['GHEM', 'MUDK'],
    "MUDK": ['MIAA', 'RDPK'],
    "RDPK": ['MUDK', 'NRSN'],
    "NRSN": ['RDPK', 'NNOI'],
    "NNOI": ['NRSN', 'SMSM'],
    "SMSM": ['NNOI', 'UNRG'],
    "UNRG": ['SMSM', 'PAGI'],
    "PAGI": ['UNRG', 'PVW'],
    "PVW": ['PAGI', 'PVE'],
    "PVE": ['PVW', 'MAPR'],
    "MAPR": ['PVE', 'SHVP'],
    "SHVP": ['MAPR', 'PBGA'],
    "PBGA": ['SHVP', 'APMN'],
    "APMN": ['PBGA', 'SRSM'],
    "SRSM": ['APMN'],
    "LLQA": ['JAMD'],
    "JAMD": ['LLQA', 'DLIG'],
    "DLIG": ['JAMD', 'ITO'],
    "ITO": ['DLIG', 'JNPH'],
    "JNPH": ['ITO', 'KM'],
    "KM": ['JNPH', 'JLNS'],
    "JLNS": ['KM', 'JGPA'],
    "JGPA": ['JLNS', 'MLCD'],
    "MLCD": ['JGPA', 'KHCY'],
    "KHCY": ['MLCD', 'NP'],
    "NP": ['KHCY', 'GDPI'],
    "GDPI": ['NP', 'HNOK'],
    "HNOK": ['GDPI', 'JLA'],
    "JLA": ['HNOK', 'STVR'],
    "STVR": ['JLA', 'METE'],
    "METE": ['STVR', 'TKDS'],
    "TKDS": ['METE', 'BAPB'],
    "BAPB": ['TKDS', 'SRAI'],
    "SRAI": ['BAPB', 'NHPC'],
    "NHPC": ['SRAI', 'MMJR'],
    "MMJR": ['NHPC', 'STTA'],
    "STTA": ['MMJR', 'BKMR'],
    "BKMR": ['STTA', 'OFDB'],
    "OFDB": ['BKMR', 'NCAJ'],
    "NCAJ": ['OFDB', 'BACH'],
    "BACH": ['NCAJ', 'ECMJ'],
    "ECMJ": ['BACH', 'NCBC'],
    "NCBC": ['ECMJ'],
    "SMBG": ['SAKP'],
    "SAKP": ['SMBG', 'ESIH'],
    "ESIH": ['SAKP', 'MYPI'],
    "MYPI": ['ESIH', 'NAVR'],
    "NAVR": ['MYPI', 'DLIC'],
    "DLIC": ['NAVR', 'DDSC'],
    "DDSC": ['DLIC', 'SVMB'],
    "SVMB": ['DDSC', 'BKCP'],
    "BKCP": ['SVMB', 'SOJI'],
    "SOJI": ['BKCP', 'SOEN'],
    "SOEN": ['SOJI', 'VNPR'],
    "VNPR": ['SOEN', 'AHRM'],
    "AHRM": ['VNPR', 'NIZM'],
    "NIZM": ['AHRM', 'MVPO'],
    "MVPO": ['NIZM', 'TKPR'],
    "TKPR": ['MVPO', 'VENT'],
    "VENT": ['TKPR', 'VNNR'],
    "VNNR": ['VENT', 'IPE'],
    "IPE": ['VNNR', 'KKDC'],
    "KKDC": ['IPE', 'KHNA'],
    "KHNA": ['KKDC', 'EANR'],
    "EANR": ['KHNA', 'JFRB'],
    "JFRB": ['EANR', 'MUPR'],
    "MUPR": ['JFRB', 'GKPR'],
    "GKPR": ['MUPR', 'JIEE'],
    "JIEE": ['GKPR'],
    "DBMR": ['DSHP'],
    "DSHP": ['DBMR', 'PALM'],
    "PALM": ['DSHP', 'SABR'],
    "SABR": ['PALM', 'IGDA'],
    "IGDA": ['SABR', 'SKVR'],
    "SKVR": ['IGDA', 'VTVR'],
    "VTVR": ['SKVR', 'MIRK'],
    "MIRK": ['VTVR', 'RKPM'],
    "RKPM": ['MIRK', 'IIT'],
    "IIT": ['RKPM', 'PSPK'],
    "PSPK": ['IIT', 'CDLI'],
    "CDLI": ['PSPK', 'GKEI'],
    "GKEI": ['CDLI', 'NUEE'],
    "NUEE": ['GKEI', 'OKNS'],
    "OKNS": ['NUEE', 'IWNR'],
    "IWNR": ['OKNS', 'JANR'],
    "JANR": ['IWNR', 'OVA'],
    "OVA": ['JANR', 'JLA8'],
    "JLA8": ['OVA', 'KIKJ'],
    "KIKJ": ['JLA8', 'OKBS'],
    "OKBS": ['KIKJ'],
    "NNGI": ['NFGH'],
    "NFGH": ['NNGI'],
    "SJSU": ['DACY'],
    "DACY": ['SJSU', 'APOT'],
    "APOT": ['DACY'],
    "BEL": ['GAT'],
    "GAT": ['BEL', 'MAL'],
    "MAL": ['GAT', 'DL3'],
    "DL3": ['MAL', 'PH1'],
    "PH1": ['DL3', 'SUL'],
    "SUL": ['PH1', 'S53'],
    "S53": ['SUL', 'AIT'],
    "AIT": ['S53'],
};

// Define stations with IDs
const stations = [

    { name: "Rohini West", id: "RHW" },
    { name: "Rohini East", id: "RHE" },
    { name: "Pitampura", id: "PTP" },
    { name: "Kohat Enclave", id: "KE" },
    { name: "Keshav Puram", id: "KP" },
    { name: "Kanhaiya Nagar", id: "KN" },
    { name: "Shastri Nagar", id: "SHT" },
    { name: "Pratap Nagar", id: "PRA" },
    { name: "Pulbangash", id: "PBGH" },
    { name: "Tis Hazari", id: "TZI" },
    { name: "Shastri Park", id: "SHPK" },
    { name: "Seelampur", id: "SLAP" },
    { name: "Shahdara", id: "SHD" },
    { name: "Mansarovar Park", id: "MPK" },
    { name: "Jhilmil", id: "JLML" },
    { name: "Dilshad Garden", id: "DSG" },
    { name: "Shaheed Nagar", id: "SHDN" },
    { name: "Raj Bagh", id: "RJBH" },
    { name: "Major Mohit Sharma", id: "RJNM" },
    { name: "Shyam Park", id: "SMPK" },
    { name: "Mohan Nagar", id: "MNGM" },
    { name: "Arthala", id: "ATHA" },
    { name: "Hindon River", id: "HDNR" },


    { name: "Rohini Sector", id: "RISE" },
    { name: "Haiderpur Badli Mor", id: "BIMR" },
    { name: "JahangirPuri", id: "JGPI" },
    { name: "Adarsh Nagar", id: "AHNR" },
    { name: "Model Town", id: "MDTW" },
    { name: "Guru Teg Bahadur", id: "GTBR" },
    { name: "Vishwavidyalaya", id: "VW" },
    { name: "Vidhan Sabha", id: "VS" },
    { name: "Civil Lines", id: "CL" },
    { name: "Chandni Chowk", id: "CHK" },
    { name: "Chawri Bazar", id: "CWBR" },
    { name: "Patel Chowk", id: "PTCK" },
    { name: "Udyog Bhawan", id: "UDB" },
    { name: "Lok Kalyan Marg", id: "LKM" },
    { name: "Jor Bagh", id: "JB" },
    { name: "AIIMS", id: "AIIMS" },
    { name: "Green Park", id: "GNPK" },
    { name: "Malviya Nagar", id: "MVNR" },
    { name: "Saket", id: "SAKT" },
    { name: "Qutab Minar", id: "QM" },
    { name: "Chhatarpur", id: "CHTP" },
    { name: "Sultanpur", id: "SLTP" },
    { name: "Ghitorni", id: "GTNI" },
    { name: "Arjan Garh", id: "AJG" },
    { name: "Guru Dronacharya", id: "GE" },
    { name: "M.G. Road", id: "MGRO" },
    { name: "IFFCO Chowk", id: "IFOC" },

    { name: "Dwarka Sector - 8", id: "DSET" },
    { name: "Dwarka Sector - 9", id: "DSN" },
    { name: "Dwarka Sector - 10", id: "DST" },
    { name: "Dwarka Sector - 11", id: "DSE" },
    { name: "Dwarka Sector - 12", id: "DSW" },
    { name: "Dwarka Sector - 13", id: "DSTN" },
    { name: "Dwarka Sector - 14", id: "DSFN" },
    { name: "Dwarka Mor", id: "DM" },
    { name: "Nawada", id: "NWD" },
    { name: "Uttam Nagar West", id: "UNW" },
    { name: "Uttam Nagar East", id: "UNE" },
    { name: "Janakpuri East", id: "JPE" },
    { name: "Tilak Nagar", id: "TN" },
    { name: "Subhash Nagar", id: "SN" },
    { name: "Tagore Garden", id: "TG" },
    { name: "Ramesh Nagar", id: "RN" },
    { name: "Moti Nagar", id: "MN" },
    { name: "Shadipur", id: "SP" },
    { name: "Patel Nagar", id: "PN" },
    { name: "Rajendra Place", id: "RP" },
    { name: "Karol Bagh", id: "KB" },
    { name: "Jhandewalan", id: "JW" },
    { name: "Ramakrishna Ashram", id: "RKAM" },
    { name: "Barakhamba Road", id: "BRKR" },
    { name: "Supreme Court", id: "PTMD" },
    { name: "Indraprastha", id: "IDPT" },
    { name: "Akshardham", id: "ASDM" },
    { name: "Mayur Vihar", id: "MVE" },
    { name: "New Ashok Nagar", id: "NAGR" },
    { name: "Noida Sec-15", id: "NSFT" },
    { name: "Noida Sec-16", id: "NSST" },
    { name: "Noida Sec-18", id: "NSET" },
    { name: "Golf Course", id: "GEC" },
    { name: "Noida City Centre", id: "NCC" },
    { name: "Sector-34 Noida", id: "STFN" },
    { name: "Sec-52 Noida", id: "SFTN" },
    { name: "Sec-61 Noida", id: "SSON" },
    { name: "Sec-59 Noida", id: "SFNN" },
    { name: "Sec-62 Noida", id: "SSTN" },
    { name: "Laxmi Nagar", id: "LN" },
    { name: "Nirman Vihar", id: "NV" },
    { name: "Preet Vihar", id: "PTVR" },
    { name: "Kaushambi", id: "KSHI" },

    { name: "Bahadurgarh City", id: "BUSS" },
    { name: "Pandit Shree Ram", id: "MIEE" },
    { name: "Tikri Border", id: "TKBR" },
    { name: "Tikri Kalan", id: "TKLM" },
    { name: "Ghevra Metro Station", id: "GHEM" },
    { name: "Mundka Industrial", id: "MIAA" },
    { name: "Mundka", id: "MUDK" },
    { name: "Rajdhani Park", id: "RDPK" },
    { name: "Nangloi Railway", id: "NRSN" },
    { name: "Nangloi", id: "NNOI" },
    { name: "Maharaja Surajmal", id: "SMSM" },
    { name: "Udyog Nagar", id: "UNRG" },
    { name: "Peeragarhi", id: "PAGI" },
    { name: "Paschim Vihar West", id: "PVW" },
    { name: "Paschim Vihar East", id: "PVE" },
    { name: "Madipur", id: "MAPR" },
    { name: "Shivaji Park", id: "SHVP" },
    { name: "Punjabi Bagh", id: "PBGA" },
    { name: "Ashok Park Main", id: "APMN" },
    { name: "Satguru Ram Singh", id: "SRSM" },

    { name: "Lal Quila", id: "LLQA" },
    { name: "Jama Masjid", id: "JAMD" },
    { name: "Delhi Gate", id: "DLIG" },
    { name: "ITO", id: "ITO" },
    { name: "Janpath", id: "JNPH" },
    { name: "Khan Market", id: "KM" },
    { name: "JLN Stadium", id: "JLNS" },
    { name: "Jangpura", id: "JGPA" },
    { name: "Moolchand", id: "MLCD" },
    { name: "Kailash Colony", id: "KHCY" },
    { name: "Nehru Place", id: "NP" },
    { name: "Govind Puri", id: "GDPI" },
    { name: "Harkesh Nagar Okhla", id: "HNOK" },
    { name: "Jasola Apollo", id: "JLA" },
    { name: "Sarita Vihar", id: "STVR" },
    { name: "Mohan Estate", id: "METE" },
    { name: "Tughlakabad Station", id: "TKDS" },
    { name: "Badarpur Border", id: "BAPB" },
    { name: "Sarai", id: "SRAI" },
    { name: "NHPC Chowk", id: "NHPC" },
    { name: "Mewala Maharajpur", id: "MMJR" },
    { name: "Sector-28", id: "STTA" },
    { name: "Badkal Mor", id: "BKMR" },
    { name: "Old Faridabad", id: "OFDB" },
    { name: "Neelam Chowk Ajronda", id: "NCAJ" },
    { name: "Bata Chowk", id: "BACH" },
    { name: "Ecorts Mujesar", id: "ECMJ" },
    { name: "Sant Surdas (Sihi)", id: "NCBC" },

    { name: "Shalimar Bagh", id: "SMBG" },
    { name: "Shakurpur", id: "SAKP" },
    { name: "ESI-Basaidarapur", id: "ESIH" },
    { name: "Mayapuri", id: "MYPI" },
    { name: "Naraina Vihar", id: "NAVR" },
    { name: "Delhi Cantt", id: "DLIC" },
    { name: "Durgabai Deshmukh", id: "DDSC" },
    { name: "Sir M.", id: "SVMB" },
    { name: "Bhikaji Cama Place", id: "BKCP" },
    { name: "Sarojini Nagar", id: "SOJI" },
    { name: "South Extention", id: "SOEN" },
    { name: "Vinobapuri", id: "VNPR" },
    { name: "Ashram", id: "AHRM" },
    { name: "Sarai Kale Khan", id: "NIZM" },
    { name: "Mayur Vihar Pocket-1", id: "MVPO" },
    { name: "Trilokpuri-Sanjay", id: "TKPR" },
    { name: "East Vinod Nagar-", id: "VENT" },
    { name: "Mandawali West Vinod", id: "VNNR" },
    { name: "IP Extension", id: "IPE" },
    { name: "Karkarduma Court", id: "KKDC" },
    { name: "Krishna Nagar", id: "KHNA" },
    { name: "East Azad Nagar", id: "EANR" },
    { name: "Jafrabad", id: "JFRB" },
    { name: "Maujpur-Babarpur", id: "MUPR" },
    { name: "Gokulpuri", id: "GKPR" },
    { name: "Johri Enclave", id: "JIEE" },

    { name: "Dabri Mor- Janakpuri", id: "DBMR" },
    { name: "Dashrathpuri", id: "DSHP" },
    { name: "Palam", id: "PALM" },
    { name: "Sadar Bazar", id: "SABR" },
    { name: "Terminal-1 IGI", id: "IGDA" },
    { name: "Shankar Vihar", id: "SKVR" },
    { name: "Vasant Vihar", id: "VTVR" },
    { name: "Munirka", id: "MIRK" },
    { name: "R K Puram", id: "RKPM" },
    { name: "IIT", id: "IIT" },
    { name: "Panchsheel Park", id: "PSPK" },
    { name: "Chirag Delhi", id: "CDLI" },
    { name: "Greater Kailash", id: "GKEI" },
    { name: "Nehru Enclave", id: "NUEE" },
    { name: "Okhla NSIC", id: "OKNS" },
    { name: "Sukhdev Vihar", id: "IWNR" },
    { name: "Jamia Millia Islamia", id: "JANR" },
    { name: "Okhla Vihar", id: "OVA" },
    { name: "Jasola Vihar Shaheen", id: "JLA8" },
    { name: "Kalindi Kunj", id: "KIKJ" },
    { name: "Okhla Bird Sanctuary", id: "OKBS" },

    { name: "Nangli", id: "NNGI" },
    { name: "Najafgarh", id: "NFGH" },

    { name: "Shivaji Stadium", id: "SJSU" },
    { name: "Delhi Aerocity", id: "DACY" },
    { name: "Airport(T-3)", id: "APOT" },

    { name: "Belvedere Towers", id: "BEL" },
    { name: "Cyber City", id: "GAT" },
    { name: "Moulsari Avenue", id: "MAL" },
    { name: "Phase-3", id: "DL3" },
    { name: "Phase-1", id: "PH1" },
    { name: "Sector 42-43", id: "SUL" },
    { name: "Sector 53-54", id: "S53" },
    { name: "Sector 54 Chowk", id: "AIT" },
];

// Find shortest path using Breadth-First Search
function findShortestPath(start, end) {
    let queue = [[start]];
    let visited = new Set();

    while (queue.length > 0) {
        let path = queue.shift();
        let station = path[path.length - 1];

        if (station === end) return path.length - 1;

        if (!visited.has(station)) {
            visited.add(station);
            let neighbors = connections[station] || [];
            neighbors.forEach(neighbor => {
                let newPath = [...path, neighbor];
                queue.push(newPath);
            });
        }
    }
    return -1;
}




document.getElementById('showRouteFare').addEventListener('click', function () {
    // Get selected station values
    const selectedFrom = document.getElementById('startSearch').value;
    const selectedTo = document.getElementById('endSearch').value;

    const selectedFromId = getStationId(selectedFrom);
    const selectedToId = getStationId(selectedTo);

    // Validate selected stations
    if (!selectedFromId || !selectedToId) {
        alert('Please select both start and end stations.');
        return;
    }

    // Get journey date and time values
    const journeyDate = document.getElementById('journey-date').value;
    const journeyTime = document.getElementById('journey-time').value;

    // Validate journey date and time
    if (!journeyDate || !journeyTime) {
        alert('Please select both journey date and time.');
        return;
    }

    // If all validations pass, calculate fare
    const shortestPath = findShortestPath(selectedFromId, selectedToId);
    if (shortestPath === -1) {
        alert('No route found between the selected stations.');
        return;
    }

    const fare = shortestPath * 10; // Example fare calculation
    const numberOfStations = shortestPath; // Assuming the number of stations is the same as the path length

    // Populate fare display
    document.getElementById('fromResult').textContent = selectedFrom;
    document.getElementById('toResult').textContent = selectedTo;
    document.getElementById('dateResult').textContent = journeyDate;
    document.getElementById('timeResult').textContent = journeyTime;
    document.getElementById('fareResult').textContent = `Rs ${fare}`;
    document.getElementById('stationsResult').textContent = numberOfStations;

    // Show the fare display
    document.getElementById('fareDisplay').style.display = 'block';
});

// Function to close the fare display
function closeFareDisplay() {
    document.getElementById('fareDisplay').style.display = 'none';
}



// Function to get station ID based on station name
function getStationId(stationName) {
    // Assuming stations is an array of objects with id and name properties
    const station = stations.find(s => s.name === stationName);
    return station ? station.id : null;
}

// Event listener for the "Book Ticket" button
document.getElementById("bookTicketButton").addEventListener("click", () => {
    const from = document.getElementById("startSearch").value; // Get 'From' station
    const to = document.getElementById("endSearch").value;     // Get 'To' station
    const journeyDate = document.getElementById("journey-date").value; // Get journey date
    const journeyTime = document.getElementById("journey-time").value; // Get journey time

    // Check if all fields are filled
    if (!from || !to || !journeyDate || !journeyTime) {
        alert("Please fill all fields before booking the ticket!");
        return;
    }

    // Send the data to the backend
    fetch("http://localhost:5000/save-journey", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: from,
            to: to,
            journeyDate: journeyDate,
            journeyTime: journeyTime,
        }),
    })
        .then((response) => {
            if (response.ok) {
                alert("Ticket booked successfully!");
            } else {
                alert("Failed to book ticket. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while booking the ticket.");
        });
});

