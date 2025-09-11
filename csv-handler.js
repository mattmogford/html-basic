/**
 * CSV Handler for importing and parsing golf shot dispersion data
 * Expected CSV format: columns named 'Carry' (y-position) and 'Offline' (x-position)
 */

// Store for imported CSV data
let importedData = [];

/**
 * Generates a random color
 * @returns {string} Random color in hex format
 */
function generateRandomColor() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Parses CSV text and extracts data points grouped by Club
 * @param {string} csvText - The raw CSV text
 * @returns {Array} Array of datasets grouped by club with random colors
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row');
  }
  
  // Parse header to find column indices
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const carryIndex = headers.findIndex(h => h === 'carry');
  const offlineIndex = headers.findIndex(h => h === 'offline');
  const clubIndex = headers.findIndex(h => h === 'club');
  
  if (carryIndex === -1) {
    throw new Error('CSV file must contain a "Carry" column');
  }
  
  if (offlineIndex === -1) {
    throw new Error('CSV file must contain an "Offline" column');
  }
  
  if (clubIndex === -1) {
    throw new Error('CSV file must contain a "Club" column');
  }
  
  // Group data points by club
  const clubGroups = {};
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length <= Math.max(carryIndex, offlineIndex, clubIndex)) {
      console.warn(`Row ${i + 1} has insufficient columns, skipping`);
      continue;
    }
    
    const carry = parseFloat(values[carryIndex]);
    const offline = parseFloat(values[offlineIndex]);
    const club = values[clubIndex];
    
    if (isNaN(carry) || isNaN(offline) || !club) {
      console.warn(`Row ${i + 1} has invalid values, skipping`);
      continue;
    }
    
    // Initialize club group if it doesn't exist
    if (!clubGroups[club]) {
      clubGroups[club] = [];
    }
    
    // Carry becomes y (distance down field), Offline becomes x (left/right from center)
    clubGroups[club].push({
      x: offline,
      y: carry
    });
  }
  
  // Convert grouped data into datasets with random colors
  const datasets = [];
  for (const [club, dataPoints] of Object.entries(clubGroups)) {
    if (dataPoints.length > 0) {
      datasets.push({
        color: generateRandomColor(),
        data: dataPoints,
        club: club
      });
    }
  }
  
  return datasets;
}

/**
 * Handles CSV file selection and processing
 * @param {Event} event - File input change event
 */
function handleCSVFile(event) {
  const file = event.target.files[0];
  const statusDiv = document.getElementById('status');
  
  if (!file) {
    return;
  }
  
  if (!file.name.toLowerCase().endsWith('.csv')) {
    statusDiv.textContent = 'Please select a CSV file';
    statusDiv.style.color = '#d32f2f';
    return;
  }
  
  statusDiv.textContent = 'Loading CSV file...';
  statusDiv.style.color = '#1976d2';
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const csvText = e.target.result;
      const datasets = parseCSV(csvText);
      
      if (datasets.length === 0) {
        throw new Error('No valid data groups found in CSV file');
      }
      
      // Store the imported data
      importedData = datasets;
      
      // Update the visualization with CSV data
      updateVisualizationWithCSV(datasets);
      
      const totalPoints = datasets.reduce((sum, dataset) => sum + dataset.data.length, 0);
      const clubNames = datasets.map(d => d.club).join(', ');
      statusDiv.textContent = `Successfully imported ${totalPoints} data points from ${datasets.length} clubs: ${clubNames}`;
      statusDiv.style.color = '#388e3c';
      
    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
      statusDiv.style.color = '#d32f2f';
      console.error('CSV parsing error:', error);
    }
  };
  
  reader.onerror = function() {
    statusDiv.textContent = 'Error reading file';
    statusDiv.style.color = '#d32f2f';
  };
  
  reader.readAsText(file);
}

/**
 * Updates the visualization with CSV data
 * @param {Array} csvDatasets - Array of datasets from CSV
 */
function updateVisualizationWithCSV(csvDatasets) {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Calculate scaling parameters
    const scaling = calculateScaling(
      canvas.width, 
      canvas.height, 
      FIELD_WIDTH_YARDS, 
      FIELD_LENGTH_YARDS
    );
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the grid first (background)
    drawGrid(ctx, scaling);
    
    // Draw trajectory paths for CSV data
    drawTrajectoryPaths(ctx, csvDatasets, scaling);
    
    // Draw the dispersion ovals for CSV data
    drawMultipleDispersionOvals(ctx, csvDatasets, scaling);
  }
}

/**
 * Clears imported CSV data and resets to original visualization
 */
function clearCSVData() {
  importedData = [];
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = 'Data cleared. Showing original sample data.';
  statusDiv.style.color = '#666';
  
  // Reset to original data
  initializeCanvas();
  
  // Clear the file input
  const fileInput = document.getElementById('csvFile');
  fileInput.value = '';
}

/**
 * Loads the other.csv file automatically
 */
async function loadOtherCSV() {
  const statusDiv = document.getElementById('status');
  
  try {
    statusDiv.textContent = 'Loading other.csv file...';
    statusDiv.style.color = '#1976d2';
    
    const response = await fetch('other.csv');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    const datasets = parseCSV(csvText);
    
    if (datasets.length === 0) {
      throw new Error('No valid data groups found in other.csv file');
    }
    
    // Store the imported data
    importedData = datasets;
    
    // Update the visualization with CSV data
    updateVisualizationWithCSV(datasets);
    
    const totalPoints = datasets.reduce((sum, dataset) => sum + dataset.data.length, 0);
    const clubNames = datasets.map(d => d.club).join(', ');
    statusDiv.textContent = `Successfully loaded other.csv: ${totalPoints} data points from ${datasets.length} clubs: ${clubNames}`;
    statusDiv.style.color = '#388e3c';
    
    return datasets;
    
  } catch (error) {
    statusDiv.textContent = `Error loading other.csv: ${error.message}`;
    statusDiv.style.color = '#d32f2f';
    console.error('Error loading other.csv:', error);
    
    // Fallback to original sample data
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      initializeCanvas();
    }
    
    throw error;
  }
}

/**
 * Gets the current data being displayed (CSV or original)
 * @returns {Array} Current dataset array
 */
function getCurrentData() {
  if (importedData.length > 0) {
    return importedData; // importedData is now already an array of datasets
  }
  return allData; // fallback to original sample data
}