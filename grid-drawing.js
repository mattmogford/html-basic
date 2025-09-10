/**
 * Draws a grid on the canvas with straight horizontal distance lines every 50 yards and a vertical center line
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {Object} scaling - Scaling parameters from calculateScaling
 */
function drawGrid(ctx, scaling) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  
  ctx.save();
  
  // Set grid line style
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.font = Math.max(8, Math.min(12, scaling.scale * 0.3)) + 'px Arial';
  ctx.fillStyle = '#666666';
  
  // Get field boundaries
  const bounds = getFieldBounds(scaling, canvasHeight);
  
  // Draw straight horizontal distance lines every GRID_INTERVAL_YARDS yards
  for (let distance = GRID_INTERVAL_YARDS; distance <= FIELD_LENGTH_YARDS; distance += GRID_INTERVAL_YARDS) {
    // Convert field coordinates to canvas coordinates
    const leftPoint = fieldToCanvas(-FIELD_WIDTH_YARDS / 2, distance, scaling, canvasHeight);
    const rightPoint = fieldToCanvas(FIELD_WIDTH_YARDS / 2, distance, scaling, canvasHeight);
    
    // Only draw if the line is within canvas bounds
    if (leftPoint.y > 0 && leftPoint.y < canvasHeight) {
      ctx.beginPath();
      ctx.moveTo(leftPoint.x, leftPoint.y);
      ctx.lineTo(rightPoint.x, rightPoint.y);
      ctx.stroke();
      
      // Add yard labels on the left side
      const labelX = bounds.left + 5;
      const labelY = leftPoint.y - 3;
      ctx.fillText(distance + ' yds', labelX, labelY);
    }
  }
  
  // Draw vertical center line (represents the target line)
  ctx.beginPath();
  ctx.strokeStyle = '#999999';
  ctx.lineWidth = Math.max(1, scaling.scale * 0.05);
  
  // Center line from tee to end of field
  const teePoint = fieldToCanvas(0, 0, scaling, canvasHeight);
  const endPoint = fieldToCanvas(0, FIELD_LENGTH_YARDS, scaling, canvasHeight);
  
  ctx.moveTo(teePoint.x, teePoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
  
  ctx.restore();
}