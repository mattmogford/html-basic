/**
 * Draws a grid on the canvas with straight horizontal distance lines every 50 yards and a vertical center line
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 */
function drawGrid(ctx) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  
  ctx.save();
  
  // Set grid line style
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.font = '10px Arial';
  ctx.fillStyle = '#666666';
  
  // Draw straight horizontal distance lines every 50 yards
  for (let distance = 50; distance <= 300; distance += 50) {
    // Calculate Y position based on distance from tee (bottom of canvas)
    const yPosition = canvasHeight - distance;
    
    // Only draw if the line is within canvas bounds
    if (yPosition > 0 && yPosition < canvasHeight) {
      ctx.beginPath();
      ctx.moveTo(0, yPosition);
      ctx.lineTo(canvasWidth, yPosition);
      ctx.stroke();
      
      // Add yard labels on the left side
      const labelX = 5;
      const labelY = yPosition - 3;
      ctx.fillText(distance + ' yds', labelX, labelY);
    }
  }
  
  // Draw vertical center line (represents the target line)
  ctx.beginPath();
  ctx.strokeStyle = '#999999';
  ctx.lineWidth = 2;
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);
  ctx.stroke();
  
  ctx.restore();
}