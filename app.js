let airlinesData = [];
const ITEMS_PER_PAGE = 3; // Set items per page for pagination
let currentPage = 1;

// Function to Fetch Airlines Data
document.addEventListener("DOMContentLoaded", function () {
    fetchAirlines();
});

function fetchAirlines() {
    showLoadingSpinner(); 

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "airlines.json", true); 
    xhr.onload = function () {
        hideLoadingSpinner();
        if (xhr.status === 200) {
            airlinesData = JSON.parse(xhr.responseText);
            displayAirlines(airlinesData);
        } else {
            showError("Failed to load airlines.");
        }
    };
    xhr.onerror = function () {
        hideLoadingSpinner();
        showError("Network error. Please try again.");
    };
    xhr.send();
}

// Function to Display Airlines
function displayAirlines(airlines) {
    const container = document.getElementById("airlines-container");
    container.innerHTML = '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedAirlines = airlines.slice(start, start + ITEMS_PER_PAGE);

    paginatedAirlines.forEach(airline => {
        const airlineDiv = document.createElement("div");
        airlineDiv.textContent = `${airline.name} (${airline.country}) - Rating: ${airline.rating}`;
        container.appendChild(airlineDiv);
    });

    updatePagination(airlines.length);
}

// Function to Update Pagination
function updatePagination(totalItems) {
    const paginationControls = document.getElementById("pagination-controls");
    paginationControls.innerHTML = '';

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', function () {
            currentPage = i;
            displayAirlines(airlinesData);
        });
        paginationControls.appendChild(pageButton);
    }
}

// Function for Sorting
document.getElementById('sort-options').addEventListener('change', function () {
    const sortBy = this.value;
    const sortedAirlines = [...airlinesData].sort((a, b) => {
        return a[sortBy].localeCompare(b[sortBy]);
    });
    displayAirlines(sortedAirlines);
});

// Function for Filtering
document.getElementById('filter-input').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const filteredAirlines = airlinesData.filter(airline => 
        airline.country.toLowerCase().includes(filter)
    );
    displayAirlines(filteredAirlines);
});

// Error Handling Functions
function showError(message) {
    const container = document.getElementById("airlines-container");
    container.innerHTML = `<p style="color:red">${message}</p>`;
}

// Loading Spinner Functions
function showLoadingSpinner() {
    document.getElementById("airlines-container").innerHTML = "<p>Loading...</p>";
}

function hideLoadingSpinner() {
    document.getElementById("airlines-container").innerHTML = "";
}
