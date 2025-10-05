import React from 'react';
import './PlottingControls.css';

function PlottingControls({ functions, onRemoveFunction, onClearAll, onReplotAll }) {
    return (
        <div className="plotting-controls">
            <h2>Currently Plotting</h2>
            {functions.length === 0 ? (
                <p className="no-functions-message">No functions added to plot yet.</p>
            ) : (
                <>
                    <ul className="function-list">
                        {functions.map((func) => (
                            <li key={func.id} className="function-item">
                                <div className="function-info">
                                    <span className="color-swatch" style={{ backgroundColor: func.color }}></span>
                                    <span>f(x) = <strong>{func.expression}</strong></span>
                                    <span className="function-range-step">
                                        [{func.rangeStart}, {func.rangeEnd}], Step: {func.step}
                                    </span>
                                </div>
                                <button
                                    className="remove-function-button"
                                    onClick={() => onRemoveFunction(func.id)}
                                    title="Remove from plot"
                                >
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="global-plot-actions">
                        <button onClick={onReplotAll} className="replot-all-button">
                            Re-evaluate All
                        </button>
                        <button onClick={onClearAll} className="clear-all-button">
                            Clear All Plots
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default PlottingControls;