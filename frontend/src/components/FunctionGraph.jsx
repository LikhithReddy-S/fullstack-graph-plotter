import React, { useRef, useEffect } from 'react';
import './FunctionGraph.css';

function FunctionGraph({ graphData, viewport }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const DPR = window.devicePixelRatio || 1;

        // Get CSS dimensions and set canvas pixel dimensions
        const canvasWidth = canvas.offsetWidth;
        const canvasHeight = canvas.offsetHeight;
        canvas.width = canvasWidth * DPR;
        canvas.height = canvasHeight * DPR;
        ctx.scale(DPR, DPR);

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.save(); // Save the initial state of the context

        if (graphData.length === 0) {
            ctx.fillStyle = '#ccc';
            ctx.font = '20px "Segoe UI", Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('No functions plotted. Add one above!', canvasWidth / 2, canvasHeight / 2);
            ctx.restore();
            return;
        }

        const { xMin, xMax, yMin, yMax } = viewport;

        // Ensure valid viewport ranges
        if (xMax <= xMin || yMax <= yMin) {
            ctx.fillStyle = '#ff6b6b';
            ctx.font = '18px "Segoe UI", Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Invalid viewport range. Reset or adjust.', canvasWidth / 2, canvasHeight / 2);
            ctx.restore();
            return;
        }

        // Calculate scaling factors based on viewport
        const scaleX = canvasWidth / (xMax - xMin);
        const scaleY = canvasHeight / (yMax - yMin);

        // Function to transform graph coordinates to canvas coordinates
        const toCanvasX = (x) => (x - xMin) * scaleX;
        const toCanvasY = (y) => canvasHeight - (y - yMin) * scaleY; // Invert Y-axis for canvas

        // --- Draw Grid and Axes ---
        ctx.strokeStyle = '#3a3a3a'; // Grid color
        ctx.lineWidth = 0.5;
        ctx.font = '10px "Segoe UI", Arial';
        ctx.fillStyle = '#aaa';

        // Draw X-axis
        const xAxisY = toCanvasY(0);
        if (xAxisY >= 0 && xAxisY <= canvasHeight) {
            ctx.beginPath();
            ctx.moveTo(0, xAxisY);
            ctx.lineTo(canvasWidth, xAxisY);
            ctx.stroke();
            // Draw X-axis arrow (simple)
            ctx.beginPath();
            ctx.moveTo(canvasWidth, xAxisY);
            ctx.lineTo(canvasWidth - 8, xAxisY - 4);
            ctx.moveTo(canvasWidth, xAxisY);
            ctx.lineTo(canvasWidth - 8, xAxisY + 4);
            ctx.stroke();
            ctx.fillText('X', canvasWidth - 15, xAxisY + (xAxisY > canvasHeight - 20 ? -15 : 15));
        }

        // Draw Y-axis
        const yAxisX = toCanvasX(0);
        if (yAxisX >= 0 && yAxisX <= canvasWidth) {
            ctx.beginPath();
            ctx.moveTo(yAxisX, 0);
            ctx.lineTo(yAxisX, canvasHeight);
            ctx.stroke();
            // Draw Y-axis arrow (simple)
            ctx.beginPath();
            ctx.moveTo(yAxisX, 0);
            ctx.lineTo(yAxisX - 4, 8);
            ctx.moveTo(yAxisX, 0);
            ctx.lineTo(yAxisX + 4, 8);
            ctx.stroke();
            ctx.fillText('Y', yAxisX + (yAxisX > canvasWidth - 20 ? -15 : 5), 15);
        }

        // --- Draw Grid Lines and Labels ---
        const drawGridAndLabels = (start, end, scale, isXAxis) => {
            const stepMajor = calculateGridStep(start, end);
            const stepMinor = stepMajor / 5; // Smaller steps for finer grid

            for (let val = start; val <= end; val += stepMinor) {
                if (val > end) break; // Prevent overshooting due to float precision
                const canvasCoord = isXAxis ? toCanvasX(val) : toCanvasY(val);
                ctx.beginPath();
                ctx.strokeStyle = '#333'; // Minor grid color
                ctx.lineWidth = 0.2;
                if (Math.abs(val % stepMajor) < stepMinor / 2 || stepMajor < 0.001) { // Check for major grid line
                    ctx.strokeStyle = '#444'; // Major grid color
                    ctx.lineWidth = 0.5;
                    ctx.fillStyle = '#aaa';
                    ctx.font = '10px "Segoe UI", Arial';

                    let label = val.toFixed(getDecimalPlaces(stepMajor));
                    if (Math.abs(val) < Number.EPSILON * 10) label = '0'; // Handle -0.0 vs 0.0

                    if (isXAxis) {
                        if (canvasCoord >= 0 && canvasCoord <= canvasWidth && Math.abs(canvasCoord - yAxisX) > 10) {
                            ctx.fillText(label, canvasCoord, xAxisY + (xAxisY > canvasHeight - 20 ? -15 : 15));
                        }
                    } else {
                        if (canvasCoord >= 0 && canvasCoord <= canvasHeight && Math.abs(canvasCoord - xAxisY) > 10) {
                            ctx.fillText(label, yAxisX + (yAxisX > canvasWidth - 20 ? -30 : 5), canvasCoord);
                        }
                    }
                }
                if (isXAxis) {
                    ctx.moveTo(canvasCoord, 0);
                    ctx.lineTo(canvasCoord, canvasHeight);
                } else {
                    ctx.moveTo(0, canvasCoord);
                    ctx.lineTo(canvasWidth, canvasCoord);
                }
                ctx.stroke();
            }
        };

        drawGridAndLabels(xMin, xMax, scaleX, true);
        drawGridAndLabels(yMin, yMax, scaleY, false);


        // --- Draw Function Plots ---
        graphData.forEach(func => {
            ctx.beginPath();
            ctx.strokeStyle = func.color;
            ctx.lineWidth = 2;

            let firstPoint = true;
            func.points.forEach(([x, y]) => {
                const canvasX = toCanvasX(x);
                const canvasY = toCanvasY(y);

                // Only draw if the point is somewhat within the current viewport (with margin)
                if (canvasX >= -100 && canvasX <= canvasWidth + 100 &&
                    canvasY >= -100 && canvasY <= canvasHeight + 100)
                {
                    if (firstPoint) {
                        ctx.moveTo(canvasX, canvasY);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(canvasX, canvasY);
                    }
                } else if (!firstPoint) {
                    // If the current point is off-screen but we were drawing,
                    // stroke the current segment and then lift the pen.
                    ctx.stroke();
                    ctx.beginPath();
                    firstPoint = true; // Reset for next on-screen segment
                }
            });
            ctx.stroke();
        });

        // Display function expressions as a legend
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '14px "Segoe UI", Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        graphData.forEach((func, index) => {
            ctx.fillStyle = func.color; // Use function's color for its legend entry
            ctx.fillText(`f${index + 1}(x) = ${func.expression}`, 10, 10 + index * 20);
        });

        ctx.restore(); // Restore context to its initial state
    }, [graphData, viewport]); // Re-draw when graphData or viewport changes


    // Helper functions for grid step calculation (no external libraries)
    function calculateGridStep(min, max) {
        const range = max - min;
        if (range <= 0) return 1;

        const niceNumbers = [1, 2, 5];
        let exponent = Math.floor(Math.log10(range / 5)); // Aim for about 5-10 major grid lines
        let fraction = range / (Math.pow(10, exponent));

        let step = 1;
        for (let i = 0; i < niceNumbers.length; i++) {
            if (fraction / niceNumbers[i] <= 10) {
                step = niceNumbers[i];
                break;
            }
        }
        return step * Math.pow(10, exponent);
    }

    function getDecimalPlaces(num) {
        if (Math.floor(num) === num) return 0;
        return num.toString().split('.')[1]?.length || 0;
    }


    return (
        <div className="function-graph-container">
            <canvas ref={canvasRef} className="function-canvas"></canvas>
        </div>
    );
}

export default FunctionGraph;