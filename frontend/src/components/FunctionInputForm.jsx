import React, { useState } from 'react';
import './FunctionInputForm.css'; // New CSS file for this component

function FunctionInputForm({ onAddFunction, onSaveFunction, loading }) {
    const [funcExpression, setFuncExpression] = useState('');
    const [rangeStart, setRangeStart] = useState(-10);
    const [rangeEnd, setRangeEnd] = useState(10);
    const [step, setStep] = useState(0.1);
    const [lineColor, setLineColor] = useState('#61dafb'); // Default color

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!funcExpression) {
            alert("Please enter a function expression.");
            return;
        }

        const funcDetails = {
            expression: funcExpression,
            rangeStart: Number(rangeStart),
            rangeEnd: Number(rangeEnd),
            step: Number(step),
            color: lineColor,
        };
        onAddFunction(funcDetails); // Call App's handler to add and plot
        // Clear form after submission for new input
        setFuncExpression('');
        setRangeStart(-10);
        setRangeEnd(10);
        setStep(0.1);
        setLineColor(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`); // New random color for next input
    };

    const handleSaveClick = () => {
        if (!funcExpression) {
            alert("Please enter a function expression to save.");
            return;
        }
        const funcDetails = {
            expression: funcExpression,
            rangeStart: Number(rangeStart),
            rangeEnd: Number(rangeEnd),
            step: Number(step),
            // Color is not saved to DB per schema, but could be added if desired.
        };
        onSaveFunction(funcDetails);
    };

    return (
        <form className="function-input-form" onSubmit={handleSubmit}>
            <h2>Add New Function</h2>
            <div className="flex-group">
                <label htmlFor="function-expression">f(x) =</label>
                <input
                    id="function-expression"
                    type="text"
                    value={funcExpression}
                    onChange={(e) => setFuncExpression(e.target.value)}
                    placeholder="e.g., sin(x), x^2, 2*x + 1"
                    required
                    disabled={loading}
                />
            </div>
            <div className="flex-group">
                <label htmlFor="range-start">Range:</label>
                <input
                    id="range-start"
                    type="number"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    step="any"
                    required
                    disabled={loading}
                />
                <span>to</span>
                <input
                    id="range-end"
                    type="number"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    step="any"
                    required
                    disabled={loading}
                />
            </div>
            <div className="flex-group">
                <label htmlFor="step-size">Step Size:</label>
                <select
                    id="step-size"
                    value={step}
                    onChange={(e) => setStep(e.target.value)}
                    required
                    disabled={loading}
                >
                    <option value="0.005">0.005</option> {/* Added more granularity */}
                    <option value="0.01">0.01</option>
                    <option value="0.05">0.05</option>
                    <option value="0.1">0.1</option>
                    <option value="0.5">0.5</option>
                    <option value="1">1</option>
                </select>
            </div>
            <div className="flex-group">
                <label htmlFor="line-color">Color:</label>
                <input
                    id="line-color"
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="function-form-actions">
                <button type="submit" className="plot-button" disabled={loading}>
                    Add & Plot
                </button>
                <button type="button" className="save-button" onClick={handleSaveClick} disabled={loading}>
                    Save Function
                </button>
            </div>
        </form>
    );
}

export default FunctionInputForm;