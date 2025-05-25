let currentTheme = 'light';
let sortDirection = ['desc', 'desc', 'desc'];

function sortTable(columnIndex) {
    const table = document.getElementById('pricingTable');
    const tbody = table.getElementsByTagName('tbody')[0];
    const rows = Array.from(tbody.getElementsByTagName('tr'));
    const headers = table.getElementsByTagName('th');
    
    for (let header of headers) {
        header.classList.remove('sorted');
        const icon = header.querySelector('.sort-icon svg');
        if (icon) {
            icon.innerHTML = '<path d="M7 10l5-5 5 5H7zM7 14l5 5 5-5H7z"/>';
        }
    }
    
    // Toggle sort direction
    sortDirection[columnIndex] = sortDirection[columnIndex] === 'desc' ? 'asc' : 'desc';
    
    rows.sort((a, b) => {
        let aValue, bValue;
        
        if (columnIndex === 0) {
            // Network name column
            aValue = a.querySelector('.network-name').textContent.trim().toLowerCase();
            bValue = b.querySelector('.network-name').textContent.trim().toLowerCase();
            
            if (sortDirection[columnIndex] === 'desc') {
                return bValue.localeCompare(aValue);
            } else {
                return aValue.localeCompare(bValue);
            }
        } else if (columnIndex === 1) {
            // AC charging column
            const aText = a.cells[columnIndex].textContent.trim().replace('₺', '');
            const bText = b.cells[columnIndex].textContent.trim().replace('₺', '');
            
            aValue = parseFloat(aText);
            bValue = parseFloat(bText);
            
            // Handle invalid values - keep them at bottom
            const aIsValid = !isNaN(aValue) && isFinite(aValue);
            const bIsValid = !isNaN(bValue) && isFinite(bValue);
            
            if (!aIsValid && !bIsValid) return 0;
            if (!aIsValid) return 1; // a goes to bottom
            if (!bIsValid) return -1; // b goes to bottom
            
            if (sortDirection[columnIndex] === 'desc') {
                return bValue - aValue;
            } else {
                return aValue - bValue;
            }
        } else if (columnIndex === 2) {
            // DC charging column - sort by first price found
            const aText = a.cells[columnIndex].textContent.trim();
            const bText = b.cells[columnIndex].textContent.trim();
            const aMatch = aText.match(/₺(\d+\.?\d*)/);
            const bMatch = bText.match(/₺(\d+\.?\d*)/);
            
            if (!aMatch || !bMatch) return 0;
            
            const aFirstPrice = parseFloat(aMatch[1]);
            const bFirstPrice = parseFloat(bMatch[1]);
            
            if (sortDirection[columnIndex] === 'desc') {
                return bFirstPrice - aFirstPrice;
            } else {
                return aFirstPrice - bFirstPrice;
            }
        }
    });
    
    // Update sort indicator
    headers[columnIndex].classList.add('sorted');
    const icon = headers[columnIndex].querySelector('.sort-icon svg');
    if (icon) {
        if (sortDirection[columnIndex] === 'desc') {
            icon.innerHTML = '<path d="M7 14l5 5 5-5H7z"/>';
        } else {
            icon.innerHTML = '<path d="M7 10l5-5 5 5H7z"/>';
        }
    }
    
    // Reinsert sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

function searchNetworks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const table = document.getElementById('pricingTable');
    const tbody = table.getElementsByTagName('tbody')[0];
    const rows = tbody.getElementsByTagName('tr');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;

    for (let row of rows) {
        const networkName = row.querySelector('.network-name').textContent.toLowerCase();
        if (networkName.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    }

    // Show/hide no results message
    if (visibleCount === 0 && searchTerm !== '') {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const logoImg = document.getElementById('logo-img');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        themeText.textContent = 'Karanlık Mod';
        logoImg.src = 'images/logo-light.png';
        currentTheme = 'light';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
        themeText.textContent = 'Aydınlık Mod';
        logoImg.src = 'images/logo-dark.png';
        currentTheme = 'dark';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set default theme
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    // Start with light theme
    themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    themeText.textContent = 'Karanlık Mod';
    
    // Initialize all rows as visible
    const tbody = document.getElementById('pricingTable').getElementsByTagName('tbody')[0];
    const rows = tbody.getElementsByTagName('tr');
    for (let row of rows) {
        row.style.display = '';
    }
    
    sortTable(0);
});