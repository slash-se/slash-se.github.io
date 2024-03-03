let currentPage = 1;
let linesPerPage = 10;
let csvArray = [];

document.getElementById('linesToShow').addEventListener('change', function () {
    linesPerPage = parseInt(this.value);
    currentPage = 1; // Reset to the first page
    displayPage();
});

// Replace with your Google Sheets published CSV link
const googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsessdJZOezCrjX9AVfo2YmVLvOkMstONe1SlzoUa2Jc_WkQ6MO-yVraqR7hgWIGliTh5wuadkBHV3/pub?output=csv';

function loadDataFromGoogleSheets() {
    fetch(googleSheetsURL)
        .then(response => response.text())
        .then(csv => {
            csvArray = csv.split(/\r\n|\n/).map(line => line.split(','));
            currentPage = 1;
            displayPage();
        })
        .catch(error => console.error('Error loading the Google Sheets data:', error));
}

function displayPage() {
    const table = document.createElement('table');
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

function navigate(direction) {
    const totalPages = Math.ceil(csvArray.length / linesPerPage);
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    displayPage();
}
