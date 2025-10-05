import React, { useRef, useEffect } from 'react';
import './FunctionGraph.css';

function FunctionGraph({ points, funcExpression }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const DPR = window.devicePixelRatio || 1; // Get device pixel ratio

        // Adjust canvas dimensions for high-DPI screens
        const canvasWidth = canvas.offsetWidth; // Get CSS dimensions
        const canvasHeight = canvas.offsetHeight;
        canvas.width = canvasWidth * DPR;
        canvas.height = canvasHeight * DPR;
        ctx.scale(DPR, DPR); // Scale context to match CSS dimensions

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (points.length === 0) {
            ctx.fillStyle = '#ccc';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Plot function to see graph', canvasWidth / 2, canvasHeight / 2);
            return;
        }

        // Determine min/max X and Y values from points
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        points.forEach(([x, y]) => {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        });

        // Add some padding to the view
        const paddingX = (maxX - minX) * 0.1 || 1; // At least 1 if range is zero
        const paddingY = (maxY - minY) * 0.1 || 1;
        minX -= paddingX;
        maxX += paddingX;
        minY -= paddingY;
        maxY += paddingY;

        // Ensure a minimum range if all points are very close
        if (maxX - minX < 0.1) {
            maxX += 0.05;
            minX -= 0.05;
        }
        if (maxY - minY < 0.1) {
            maxY += 0.05;
            minY -= 0.05;
        }


        // Calculate scaling factors
        const scaleX = canvasWidth / (maxX - minX);
        const scaleY = canvasHeight / (maxY - minY);

        // Function to transform graph coordinates to canvas coordinates
        const toCanvasX = (x) => (x - minX) * scaleX;
        const toCanvasY = (y) => canvasHeight - (y - minY) * scaleY; // Invert Y-axis for canvas

        // --- Draw Grid and Axes ---
        ctx.strokeStyle = '#555'; // Grid color
        ctx.lineWidth = 0.5;
        ctx.font = '10px Arial';
        ctx.fillStyle = '#aaa';

        // Draw X-axis
        const xAxisY = toCanvasY(0);
        if (xAxisY >= 0 && xAxisY <= canvasHeight) {
            ctx.beginPath();
            ctx.moveTo(0, xAxisY);
            ctx.lineTo(canvasWidth, xAxisY);
            ctx.stroke();
        }

        // Draw Y-axis
        const yAxisX = toCanvasX(0);
        if (yAxisX >= 0 && yAxisX <= canvasWidth) {
            ctx.beginPath();
            ctx.moveTo(yAxisX, 0);
            ctx.lineTo(yAxisX, canvasHeight);
            ctx.stroke();
        }

        // Draw grid lines and labels (simplified for brevity)
        // You can add more sophisticated grid/label drawing here if needed
        const drawGridLine = (val, isXAxis) => {
            if (isXAxis) {
                const x = toCanvasX(val);
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvasHeight);
                ctx.stroke();
                // Label for x-axis (can be optimized for spacing)
                if (xAxisY >= 0 && xAxisY <= canvasHeight) {
                    ctx.fillText(val.toFixed(1), x, xAxisY + 15);
                } else {
                     ctx.fillText(val.toFixed(1), x, canvasHeight - 5);
                }

            } else {
                const y = toCanvasY(val);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvasWidth, y);
                ctx.stroke();
                // Label for y-axis
                if (yAxisX >= 0 && yAxisX <= canvasWidth) {
                     ctx.fillText(val.toFixed(1), yAxisX - 25, y);
                } else {
                    ctx.fillText(val.toFixed(1), 5, y);
                }
            }
        };

        // Example: Draw major grid lines at intervals (adjust as needed)
        for (let x = Math.ceil(minX); x <= Math.floor(maxX); x += 1) {
            drawGridLine(x, true);
        }
        for (let y = Math.ceil(minY); y <= Math.floor(maxY); y += 1) {
            drawGridLine(y, false);
        }

        // --- Draw Function Plot ---
        ctx.beginPath();
        ctx.strokeStyle = '#61dafb'; // Function line color
        ctx.lineWidth = 2;

        points.forEach(([x, y], index) => {
            const canvasX = toCanvasX(x);
            const canvasY = toCanvasY(y);

            // Only draw if point is within canvas bounds
            if (canvasX >= -50 && canvasX <= canvasWidth + 50 &&
                canvasY >= -50 && canvasY <= canvasHeight + 50) // Allow slight overflow
            {
                if (index === 0) {
                    ctx.moveTo(canvasX, canvasY);
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            } else if (index > 0) {
                // If the previous point was on-screen but current is off, draw a segment
                // If current point is off-screen, lift the pen
                ctx.stroke();
                ctx.beginPath();
            }
        });
        ctx.stroke();

        // Display function expression
        ctx.fillStyle = '#61dafb';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`f(x) = ${funcExpression}`, 10, 10);

    }, [points, funcExpression]); // Re-draw when points or expression changes

    return (
        <div className="function-graph-container">
            <h2>Graph Area</h2>
            <canvas ref={canvasRef} className="function-canvas"></canvas>
        </div>
    );
}

export default FunctionGraph;