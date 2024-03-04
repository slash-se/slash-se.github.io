let currentPage = 1;
let linesPerPage = 10;
let csvArray = [];
let sortDirection = 'asc'; // Tracks the current sort direction
let currentSortColumn = null; // Tracks the currently sorted column

document.getElementById('linesToShow').addEventListener('change', function () {
    linesPerPage = parseInt(this.value);
    currentPage = 1; // Reset to the first page
    displayPage();
});

const googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsessdJZOezCrjX9AVfo2YmVLvOkMstONe1SlzoUa2Jc_WkQ6MO-yVraqR7hgWIGliTh5wuadkBHV3/pub?output=csv';

function loadDataFromGoogleSheets() {
    fetch(googleSheetsURL)
        .then(response => response.text())
        .then(csv => {
            const allRows = csv.split(/\r\n|\n/).map(line => line.split(','));
            csvArray = allRows.slice(1); // Skip header row for sorting data
            displayPage(allRows[0]); // Pass headers for initial display
        })
        .catch(error => console.error('Error loading the Google Sheets data:', error));
}

function displayPage(headers) {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    
    // Create headers
    headers.forEach((header, index) => {
        const headerCell = document.createElement('th');
        headerCell.textContent = header;
        headerCell.onclick = () => sortColumn(index);
        headerRow.appendChild(headerCell);
    });
    table.appendChild(headerRow);

    const startIndex = (currentPage - 1) * linesPerPage;
    const endIndex = startIndex + linesPerPage;
    csvArray.slice(startIndex, endIndex).forEach(row => {
        const rowElement = document.createElement('tr');
        row.forEach(cell => {
            const cellElement = document.createElement('td');
            cellElement.textContent = cell;
            rowElement.appendChild(cellElement);
        });
        table.appendChild(rowElement);
    });

    document.getElementById('csvRoot').innerHTML = '';
    document.getElementById('csvRoot').appendChild(table);
}

function sortColumn(columnIndex) {
    if (columnIndex === currentSortColumn) {
        // Toggle sort direction
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortDirection = 'asc';
        currentSortColumn = columnIndex;
    }

    csvArray.sort((a, b) => {
        const valueA = a[columnIndex];
        const valueB = b[columnIndex];

        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    displayPage(csvArray[0]); // Re-display the page with sorted data
}

function navigate(direction) {
    const totalPages = Math.ceil(csvArray.length / linesPerPage);
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    displayPage(csvArray[0]);
}
