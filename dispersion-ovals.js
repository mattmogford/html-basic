/**
 * Draws multiple standard deviational ellipses (dispersion ovals) on a canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {Array<Object>} datasets - An array of dataset objects, where each dataset has 'color' and 'data' properties.
 * @param {Object} scaling - Scaling parameters from calculateScaling
 */
function drawMultipleDispersionOvals(ctx, datasets, scaling) {
  const canvasHeight = ctx.canvas.height;

  datasets.forEach((dataset, i) => {
    const data = dataset.data;
    const color = dataset.color;
    
    if (data.length < 2) {
      console.error("Not enough data points in a dataset to draw a dispersion oval.");
      return;
    }

    // 1. Calculate the mean center
    const n = data.length;
    const sumX = data.reduce((acc, point) => acc + point.x, 0);
    const sumY = data.reduce((acc, point) => acc + point.y, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;

    // 2. Calculate the orientation (theta)
    const tildeX = data.map((point) => point.x - meanX);
    const tildeY = data.map((point) => point.y - meanY);

    const sumTildeXSquared = tildeX.reduce((acc, val) => acc + val * val, 0);
    const sumTildeYSquared = tildeY.reduce((acc, val) => acc + val * val, 0);
    const sumTildeXY = tildeX.reduce((acc, val, i) => acc + val * tildeY[i], 0);

    const theta =
      Math.atan(
        (sumTildeXSquared - sumTildeYSquared + Math.sqrt(Math.pow(sumTildeXSquared - sumTildeYSquared, 2) + 4 * Math.pow(sumTildeXY, 2))) / (2 * sumTildeXY)
      );

    // 3. Calculate the semi-axes
    const sigmaX = Math.sqrt(
      tildeX.reduce(
        (acc, val, i) => acc + Math.pow(val * Math.cos(theta) - tildeY[i] * Math.sin(theta), 2),
        0
      ) / n
    );

    const sigmaY = Math.sqrt(
      tildeX.reduce(
        (acc, val, i) => acc + Math.pow(val * Math.sin(theta) - tildeY[i] * Math.cos(theta), 2),
        0
      ) / n
    );

    // 4. Draw the ellipse using the new scaling system
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, scaling.scale * 0.05);

    // Convert to canvas coordinates using the new scaling system
    const centerPoint = fieldToCanvas(meanX, meanY, scaling, canvasHeight);

    // Calculate radii with minimum size, scaled appropriately
    const minRadius = Math.max(1, scaling.scale * 0.5);
    const rx = Math.max(sigmaX * scaling.scale, minRadius);
    const ry = Math.max(sigmaY * scaling.scale, minRadius);

    // Draw ellipse using the ellipse method directly at the correct angle
    ctx.beginPath();
    ctx.ellipse(centerPoint.x, centerPoint.y, rx, ry, theta, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.restore();
  });
}