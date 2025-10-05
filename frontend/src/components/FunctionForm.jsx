import React, { useState, useEffect } from 'react';
import './FunctionForm.css';

function FunctionForm({ initialFunction, initialRange, initialStep, onPlot, onSave, loading }) {
    const [funcExpression, setFuncExpression] = useState(initialFunction);
    const [rangeStart, setRangeStart] = useState(initialRange[0]);
    const [rangeEnd, setRangeEnd] = useState(initialRange[1]);
    const [step, setStep] = useState(initialStep);

    // Update form fields when initial props change (e.g., when plotting a saved function)
    useEffect(() => {
        setFuncExpression(initialFunction);
        setRangeStart(initialRange[0]);
        setRangeEnd(initialRange[1]);
        setStep(initialStep);
    }, [initialFunction, initialRange, initialStep]);

    const handlePlot = (e) => {
        e.preventDefault();
        onPlot(funcExpression, [Number(rangeStart), Number(rangeEnd)], Number(step));
    };

    const handleSave = () => {
        onSave(funcExpression, Number(rangeStart), Number(rangeEnd), Number(step));
    };

    return (
        <form className="function-form" onSubmit={handlePlot}>
            <h2>Plot a Function</h2>
            <div className="form-group">
                <label htmlFor="function-expression">f(x) =</label>
                <input
                    id="function-expression"
                    type="text"
                    value={funcExpression}
                    onChange={(e) => setFuncExpression(e.target.value)}
                    placeholder="e.g., sin(x), x^2, 2*x + 1"
                    required
                />
            </div>
            <div className="form-group range-group">
                <label htmlFor="range-start">Range:</label>
                <input
                    id="range-start"
                    type="number"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    step="any"
                    required
                />
                <span>to</span>
                <input
                    id="range-end"
                    type="number"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    step="any"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="step-size">Step Size:</label>
                <select
                    id="step-size"
                    value={step}
                    onChange={(e) => setStep(e.target.value)}
                    required
                >
                    <option value="0.01">0.01</option>
                    <option value="0.05">0.05</option>
                    <option value="0.1">0.1</option>
                    <option value="0.5">0.5</option>
                    <option value="1">1</option>
                </select>
            </div>
            <div className="form-actions">
                <button type="submit" disabled={loading}>
                    {loading ? 'Plotting...' : 'Plot Function'}
                </button>
                <button type="button" className="save-button" onClick={handleSave} disabled={loading}>
                    Save Function
                </button>
            </div>
        </form>
    );
}

export default FunctionForm;