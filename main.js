// Sample data for the golf shot dispersion visualization
const allData = [
  // First dataset for a red ellipse (right side, mid-field)
  {
    color: 'red',
    data: [{ x: 30, y: 120 }, { x: 35, y: 130 }, { x: 40, y: 125 }]
  },
  // Second dataset for a blue ellipse (left side, lower field)
  {
    color: 'blue',
    data: [{ x: -25, y: 80 }, { x: -30, y: 85 }, { x: -20, y: 75 }]
  },
  // Third dataset for a green ellipse (right side, upper field)
  {
    color: 'green',
    data: [{ x: 45, y: 220 }, { x: 50, y: 230 }, { x: 40, y: 210 }, { x: 35, y: 225 }]
  },
  // Fourth dataset for an orange ellipse (left side, mid-field)
  {
    color: 'orange',
    data: [{ x: -40, y: 150 }, { x: -35, y: 160 }, { x: -45, y: 155 }, { x: -50, y: 145 }]
  },
  // Fifth dataset for a purple ellipse (center, upper field)
  {
    color: 'purple',
    data: [{ x: 10, y: 250 }, { x: 15, y: 260 }, { x: 5, y: 255 }, { x: 0, y: 245 }, { x: 20, y: 265 }]
  },
  // Sixth dataset for a black circle near the goal line (center)
  {
    color: 'black',
    data: [
      { x: 12, y: 25 },   // right
      { x: -12, y: 25 },  // left  
      { x: 0, y: 35 },    // up
      { x: 0, y: 15 },    // down
      { x: 8.5, y: 33.5 },   // up-right diagonal
      { x: -8.5, y: 16.5 },  // down-left diagonal
      { x: 8.5, y: 16.5 },   // down-right diagonal
      { x: -8.5, y: 33.5 }   // up-left diagonal
    ]
  }
];

// Main initialization function
function initializeCanvas() {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Calculate scaling parameters to fit the field in the canvas
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
    
    // Draw trajectory paths second (behind the dispersion ovals)
    drawTrajectoryPaths(ctx, allData, scaling);
    
    // Then draw the dispersion ovals on top
    drawMultipleDispersionOvals(ctx, allData, scaling);
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the canvas with original data
  initializeCanvas();
  
  // Set up CSV file input event listener
  const csvFileInput = document.getElementById('csvFile');
  csvFileInput.addEventListener('change', handleCSVFile);
  
  // Set up clear data button event listener
  const clearButton = document.getElementById('clearData');
  clearButton.addEventListener('click', clearCSVData);
  
  // Show initial status
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = 'Showing sample data. Import a CSV file with "Carry" and "Offline" columns to visualize your data. See sample-data.csv for format example.';
});