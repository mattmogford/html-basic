/**
 * CSV Handler for importing and parsing golf shot dispersion data
 * Expected CSV format: columns named 'Carry' (y-position) and 'Offline' (x-position)
 */

// Store for imported CSV data
let importedData = [];

/**
 * Parses CSV text and extracts data points
 * @param {string} csvText - The raw CSV text
 * @returns {Array} Array of data points with x and y coordinates
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
  
  if (carryIndex === -1) {
    throw new Error('CSV file must contain a "Carry" column');
  }
  
  if (offlineIndex === -1) {
    throw new Error('CSV file must contain an "Offline" column');
  }
  
  // Parse data rows
  const dataPoints = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length <= Math.max(carryIndex, offlineIndex)) {
      console.warn(`Row ${i + 1} has insufficient columns, skipping`);
      continue;
    }
    
    const carry = parseFloat(values[carryIndex]);
    const offline = parseFloat(values[offlineIndex]);
    
    if (isNaN(carry) || isNaN(offline)) {
      console.warn(`Row ${i + 1} has invalid numeric values, skipping`);
      continue;
    }
    
    // Carry becomes y (distance down field), Offline becomes x (left/right from center)
    dataPoints.push({
      x: offline,
      y: carry
    });
  }
  
  return dataPoints;
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
      const dataPoints = parseCSV(csvText);
      
      if (dataPoints.length === 0) {
        throw new Error('No valid data points found in CSV file');
      }
      
      // Store the imported data
      importedData = dataPoints;
      
      // Create a dataset for visualization (using blue color for imported data)
      const csvDataset = {
        color: 'blue',
        data: dataPoints
      };
      
      // Update the visualization with CSV data
      updateVisualizationWithCSV([csvDataset]);
      
      statusDiv.textContent = `Successfully imported ${dataPoints.length} data points`;
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
 * Gets the current data being displayed (CSV or original)
 * @returns {Array} Current dataset array
 */
function getCurrentData() {
  if (importedData.length > 0) {
    return [{
      color: 'blue',
      data: importedData
    }];
  }
  return allData; // fallback to original sample data
}