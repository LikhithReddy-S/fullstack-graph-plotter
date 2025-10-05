import React, { useState,  useCallback } from 'react';
import FunctionInputForm from './components/FunctionInputForm';
import FunctionGraph from './components/FunctionGraph';
import SavedFunctionsList from './components/SavedFunctionsList';
import PlottingControls from './components/PlottingControls';
import DataTableView from './components/DataTableView';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
    // State for functions to be plotted (each with expression, range, step, color, and actual points)
    // This list drives what's displayed in PlottingControls and what gets sent to FunctionGraph for drawing.
    const [functionsToPlot, setFunctionsToPlot] = useState([]); // Array of { id, expression, rangeStart, rangeEnd, step, color, dbId? }

    // State to hold all evaluated points for the graph, grouped by function.
    // This is the actual data used by FunctionGraph.
    const [graphData, setGraphData] = useState([]); // Array of { id, expression, points: [[x,y],...], color, rangeStart, rangeEnd, step }

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [savedFunctionsKey, setSavedFunctionsKey] = useState(0); // To force re-render of saved list

    // State for graph viewport (zoom/pan) - controls the visible area of the graph
    const [viewport, setViewport] = useState({
        xMin: -10, xMax: 10, yMin: -10, yMax: 10
    });

    // Helper to generate unique IDs for functions within the frontend's plotting list
    const generateUniqueId = () => `func_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Function to evaluate a single function and add its points to graphData
    const evaluateAndAddFunctionToGraph = useCallback(async (funcObj) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/eval`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    func: funcObj.expression,
                    range: [funcObj.rangeStart, funcObj.rangeEnd],
                    step: funcObj.step
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to evaluate function.');
            }

            const data = await response.json();

            // Add the new function's data to the existing graph data
            setGraphData(prevData => [
                ...prevData,
                {
                    id: funcObj.id,
                    expression: funcObj.expression,
                    color: funcObj.color,
                    points: data.points,
                    rangeStart: funcObj.rangeStart,
                    rangeEnd: funcObj.rangeEnd,
                    step: funcObj.step,
                }
            ]);

            // Optional: Auto-adjust viewport to include the newly plotted function's X-range
            // Y-axis adjustment for multiple functions is more complex and might lead to rapid changes,
            // so we'll leave Y-axis adjustments to manual zoom/pan for now to prevent visual jumps.
            const [minX, maxX] = [funcObj.rangeStart, funcObj.rangeEnd];
            setViewport(prev => ({
                xMin: Math.min(prev.xMin, minX),
                xMax: Math.max(prev.xMax, maxX),
                yMin: prev.yMin,
                yMax: prev.yMax,
            }));

            return true; // Indicate success
        } catch (err) {
            console.error('Plotting error:', err);
            setError(err.message || 'Could not plot function.');
            return false; // Indicate failure
        } finally {
            setLoading(false);
        }
    }, []);

    // Handler for adding a new function from the input form
    const handleAddFunctionForPlotting = useCallback(async ({ expression, rangeStart, rangeEnd, step, color }) => {
        const newFunc = {
            id: generateUniqueId(), // Unique ID for this plot instance
            expression,
            rangeStart: Number(rangeStart),
            rangeEnd: Number(rangeEnd),
            step: Number(step),
            color,
        };

        // Add to the list that PlottingControls displays
        setFunctionsToPlot(prev => [...prev, newFunc]);
        // Immediately try to evaluate and add to graphData
        await evaluateAndAddFunctionToGraph(newFunc);

    }, [evaluateAndAddFunctionToGraph]);

    // Handler for removing a function from the plot list and graph
    const handleRemoveFunctionFromPlot = useCallback((idToRemove) => {
        setFunctionsToPlot(prev => prev.filter(f => f.id !== idToRemove));
        setGraphData(prev => prev.filter(g => g.id !== idToRemove));
    }, []);

    // Handler for clearing all functions from the plot
    const handleClearAllFunctions = useCallback(() => {
        setFunctionsToPlot([]);
        setGraphData([]);
        setViewport({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 }); // Reset viewport
    }, []);


    // Save Function to DB
    const saveFunction = async (funcDetails) => {
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expression: funcDetails.expression,
                    range_start: funcDetails.rangeStart,
                    range_end: funcDetails.rangeEnd,
                    step: funcDetails.step,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save function.');
            }
            setSavedFunctionsKey(prev => prev + 1); // Trigger re-fetch of saved list
            alert('Function saved successfully!');
        } catch (err) {
            console.error('Saving error:', err);
            setError(err.message || 'Could not save function.');
        }
    };

    // Delete Function from DB
    const deleteFunction = async (id) => {
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete function.');
            }
            setSavedFunctionsKey(prev => prev + 1); // Trigger re-fetch of saved list
            alert('Function deleted successfully!');

            // Also remove from current plot if it was originally plotted from this saved entry
            setFunctionsToPlot(prev => prev.filter(f => f.dbId !== id));
            setGraphData(prev => prev.filter(g => g.dbId !== id));
        } catch (err) {
            console.error('Deletion error:', err);
            setError(err.message || 'Could not delete function.');
        }
    };

    // Plotting a saved function means adding it to the functionsToPlot list
    const handlePlotSavedFunction = useCallback(async (func) => {
        const newFunc = {
            id: generateUniqueId(), // New unique ID for this instance in the plot list
            dbId: func._id, // Keep track of its DB ID
            expression: func.expression,
            rangeStart: func.range_start,
            rangeEnd: func.range_end,
            step: func.step,
            color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`, // Random color for saved function
        };

        setFunctionsToPlot(prev => {
            // Check if a function with the same DB ID is already being plotted
            if (prev.some(f => f.dbId === newFunc.dbId)) {
                alert(`Function "${newFunc.expression}" from the database is already added to the plot.`);
                return prev;
            }
            return [...prev, newFunc];
        });

        await evaluateAndAddFunctionToGraph(newFunc);
    }, [evaluateAndAddFunctionToGraph]);


    // Zoom and Pan Handlers for the Graph (Pure Canvas Logic - no external libraries)
    const zoomGraph = (factor) => {
        setViewport(prev => {
            const centerX = (prev.xMin + prev.xMax) / 2;
            const centerY = (prev.yMin + prev.yMax) / 2; // Keep center
            const newXWidth = (prev.xMax - prev.xMin) * factor;
            const newYHeight = (prev.yMax - prev.yMin) * factor;

            return {
                xMin: centerX - newXWidth / 2,
                xMax: centerX + newXWidth / 2,
                yMin: centerY - newYHeight / 2,
                yMax: centerY + newYHeight / 2,
            };
        });
    };

    const panGraph = (direction, amount) => {
        setViewport(prev => {
            const currentXRange = prev.xMax - prev.xMin;
            const currentYRange = prev.yMax - prev.yMin;
            let deltaX = 0;
            let deltaY = 0;

            switch (direction) {
                case 'left': deltaX = -currentXRange * amount; break;
                case 'right': deltaX = currentXRange * amount; break;
                case 'up': deltaY = currentYRange * amount; break;
                case 'down': deltaY = -currentYRange * amount; break; // Canvas Y is inverted
                default: break;
            }

            return {
                xMin: prev.xMin + deltaX,
                xMax: prev.xMax + deltaX,
                yMin: prev.yMin + deltaY,
                yMax: prev.yMax + deltaY,
            };
        });
    };

    const resetViewport = () => {
        setViewport({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Advanced Function Plotter</h1>
                <p className="tagline">Plot multiple functions, customize, and save!</p>
            </header>

            <section className="input-section card">
                <FunctionInputForm
                    onAddFunction={handleAddFunctionForPlotting}
                    onSaveFunction={saveFunction}
                    loading={loading}
                />
            </section>

            {error && <p className="error-message">{error}</p>}
            {loading && <p className="loading-message">Evaluating function(s)...</p>}

            <section className="plotting-controls-section card">
                <PlottingControls
                    functions={functionsToPlot}
                    onRemoveFunction={handleRemoveFunctionFromPlot}
                    onClearAll={handleClearAllFunctions}
                    // onReplotAll={handleReplotAllFunctions}
                />
            </section>

            <section className="graph-section card">
                <h2>Graph Area</h2>
                <div className="graph-controls">
                    <button onClick={() => zoomGraph(0.8)}>Zoom In</button>
                    <button onClick={() => zoomGraph(1.2)}>Zoom Out</button>
                    <button onClick={() => panGraph('left', 0.2)}>Pan Left</button>
                    <button onClick={() => panGraph('right', 0.2)}>Pan Right</button>
                    <button onClick={() => panGraph('up', 0.2)}>Pan Up</button>
                    <button onClick={() => panGraph('down', 0.2)}>Pan Down</button>
                    <button onClick={resetViewport}>Reset View</button>
                </div>
                <FunctionGraph graphData={graphData} viewport={viewport} />
                <DataTableView graphData={graphData} />
            </section>

            <section className="saved-functions-section card">
                <SavedFunctionsList
                    key={savedFunctionsKey}
                    apiBaseUrl={API_BASE_URL}
                    onPlotAgain={handlePlotSavedFunction}
                    onDelete={deleteFunction}
                />
            </section>
        </div>
    );
}

export default App;