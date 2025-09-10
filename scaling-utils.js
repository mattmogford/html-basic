/**
 * Calculates the scaling parameters to fit the field within the canvas
 * while maintaining aspect ratio and centering the field
 * 
 * @param {number} canvasWidth - Width of the canvas in pixels
 * @param {number} canvasHeight - Height of the canvas in pixels
 * @param {number} fieldWidth - Width of the field in yards
 * @param {number} fieldLength - Length of the field in yards
 * @returns {Object} Scaling parameters
 */
function calculateScaling(canvasWidth, canvasHeight, fieldWidth, fieldLength) {
  // Calculate the scale needed to fit the field in the canvas
  const scaleX = canvasWidth / fieldWidth;
  const scaleY = canvasHeight / fieldLength;
  
  // Use the smaller scale to maintain aspect ratio
  const scale = Math.min(scaleX, scaleY);
  
  // Calculate the actual field size in pixels
  const fieldWidthPixels = fieldWidth * scale;
  const fieldLengthPixels = fieldLength * scale;
  
  // Calculate offsets to center the field in the canvas
  const offsetX = (canvasWidth - fieldWidthPixels) / 2;
  const offsetY = (canvasHeight - fieldLengthPixels) / 2;
  
  return {
    scale,
    offsetX,
    offsetY,
    fieldWidthPixels,
    fieldLengthPixels
  };
}

/**
 * Converts field coordinates (in yards) to canvas coordinates (in pixels)
 * Field coordinates: origin at center-bottom, Y increases upward
 * Canvas coordinates: origin at top-left, Y increases downward
 * 
 * @param {number} fieldX - X coordinate in field space (yards from center)
 * @param {number} fieldY - Y coordinate in field space (yards from tee)
 * @param {Object} scaling - Scaling parameters from calculateScaling
 * @param {number} canvasHeight - Height of the canvas
 * @returns {Object} Canvas coordinates {x, y}
 */
function fieldToCanvas(fieldX, fieldY, scaling, canvasHeight) {
  const canvasX = scaling.offsetX + (FIELD_WIDTH_YARDS / 2 + fieldX) * scaling.scale;
  const canvasY = canvasHeight - scaling.offsetY - fieldY * scaling.scale;
  
  return { x: canvasX, y: canvasY };
}

/**
 * Gets the boundaries of the field in canvas coordinates
 * 
 * @param {Object} scaling - Scaling parameters from calculateScaling
 * @param {number} canvasHeight - Height of the canvas
 * @returns {Object} Field boundaries in canvas coordinates
 */
function getFieldBounds(scaling, canvasHeight) {
  const topLeft = fieldToCanvas(-FIELD_WIDTH_YARDS / 2, FIELD_LENGTH_YARDS, scaling, canvasHeight);
  const bottomRight = fieldToCanvas(FIELD_WIDTH_YARDS / 2, 0, scaling, canvasHeight);
  
  return {
    left: topLeft.x,
    top: topLeft.y,
    right: bottomRight.x,
    bottom: bottomRight.y,
    width: scaling.fieldWidthPixels,
    height: scaling.fieldLengthPixels
  };
}