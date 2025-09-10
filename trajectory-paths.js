/**
 * Draws trajectory paths from the tee to the center of each dispersion oval
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {Array<Object>} datasets - An array of dataset objects with shot data
 * @param {number} [scaleX=1] - A scaling factor for the x-coordinates.
 * @param {number} [scaleY=1] - A scaling factor for the y-coordinates.
 */
function drawTrajectoryPaths(ctx, datasets, scaleX = 1, scaleY = 1) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const teeX = canvasWidth / 2;
  const teeY = canvasHeight;

  datasets.forEach((dataset) => {
    const data = dataset.data;
    const color = dataset.color;
    
    if (data.length < 2) {
      return;
    }
    
    // Calculate the mean center of the dataset (same as in drawMultipleDispersionOvals)
    const n = data.length;
    const sumX = data.reduce((acc, point) => acc + point.x, 0);
    const sumY = data.reduce((acc, point) => acc + point.y, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]); // Dashed line for trajectory paths
    
    // Convert mean center coordinates to canvas coordinates
    const centerX = canvasWidth / 2 + meanX * scaleX;
    const centerY = canvasHeight - meanY * scaleY;
    
    // Create a parabolic trajectory path from tee to oval center
    ctx.beginPath();
    ctx.moveTo(teeX, teeY);
    
    // Calculate control point for quadratic curve (creates arc effect)
    // Control point is above the midpoint to simulate ball flight arc
    const midX = (teeX + centerX) / 2;
    const midY = (teeY + centerY) / 2;
    const controlX = midX;
    const controlY = midY - meanY * 0.3; // Arc height proportional to distance
    
    // Draw quadratic curve from tee to oval center
    ctx.quadraticCurveTo(controlX, controlY, centerX, centerY);
    ctx.stroke();
    
    ctx.restore();
  });
}