/**
 * Draws trajectory paths from the tee to the center of each dispersion oval
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {Array<Object>} datasets - An array of dataset objects with shot data
 * @param {Object} scaling - Scaling parameters from calculateScaling
 */
function drawTrajectoryPaths(ctx, datasets, scaling) {
  const canvasHeight = ctx.canvas.height;

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
    ctx.lineWidth = Math.max(1, scaling.scale * 0.03);
    ctx.setLineDash([Math.max(2, scaling.scale * 0.06), Math.max(2, scaling.scale * 0.06)]); // Dashed line for trajectory paths
    
    // Convert coordinates using the new scaling system
    const teePoint = fieldToCanvas(0, 0, scaling, canvasHeight);
    const centerPoint = fieldToCanvas(meanX, meanY, scaling, canvasHeight);
    
    // Create a parabolic trajectory path from tee to oval center
    ctx.beginPath();
    ctx.moveTo(teePoint.x, teePoint.y);
    
    // Calculate control point for quadratic curve (creates arc effect)
    // Control point is above the midpoint to simulate ball flight arc
    const midX = (teePoint.x + centerPoint.x) / 2;
    const midY = (teePoint.y + centerPoint.y) / 2;
    const controlX = midX;
    const controlY = midY - meanY * scaling.scale * 0.3; // Arc height proportional to distance and scale
    
    // Draw quadratic curve from tee to oval center
    ctx.quadraticCurveTo(controlX, controlY, centerPoint.x, centerPoint.y);
    ctx.stroke();
    
    ctx.restore();
  });
}