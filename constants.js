// Field dimension constants
const FIELD_WIDTH_YARDS = 120;   // Total field width in yards
const FIELD_LENGTH_YARDS = 300;  // Total field length in yards

// Grid configuration
const GRID_INTERVAL_YARDS = 50;  // Distance between horizontal grid lines

// Export constants for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FIELD_WIDTH_YARDS,
    FIELD_LENGTH_YARDS,
    GRID_INTERVAL_YARDS
  };
}