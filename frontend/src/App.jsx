import React, { useState, useCallback } from 'react';
import FunctionForm from './components/FunctionForm';
import FunctionGraph from './components/FunctionGraph';
import SavedFunctionsList from './components/SavedFunctionsList';
import './App.css'; // Main application styling

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend port is different

function App() {
    const [currentFunction, setCurrentFunction] = useState('');
    const [currentRange, setCurrentRange] = useState([-10, 10]);
    const [currentStep, setCurrentStep] = useState(0.1);
    const [graphPoints, setGraphPoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [savedFunctionsKey, setSavedFunctionsKey] = useState(0); // To force re-render of saved list

    const plotFunction = useCallback(async (func, range, step) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/eval`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ func, range, step }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to evaluate function.');
            }

            const data = await response.json();
            setGraphPoints(data.points);
            setCurrentFunction(func);
            setCurrentRange(range);
            setCurrentStep(step);
        } catch (err) {
            console.error('Plotting error:', err);
            setError(err.message || 'Could not plot function.');
            setGraphPoints([]); // Clear graph on error
        } finally {
            setLoading(false);
        }
    }, []);

    const saveFunction = async (func, rangeStart, rangeEnd, step) => {
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    expression: func,
                    range_start: rangeStart,
                    range_end: rangeEnd,
                    step,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save function.');
            }

            // Force re-fetch saved functions
            setSavedFunctionsKey(prev => prev + 1);
            alert('Function saved successfully!');
        } catch (err) {
            console.error('Saving error:', err);
            setError(err.message || 'Could not save function.');
        }
    };

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

            // Force re-fetch saved functions
            setSavedFunctionsKey(prev => prev + 1);
            alert('Function deleted successfully!');
        } catch (err) {
            console.error('Deletion error:', err);
            setError(err.message || 'Could not delete function.');
        }
    };


    return (
        <div className="app-container">
            <h1>Function Plotter</h1>

            <FunctionForm
                initialFunction={currentFunction}
                initialRange={currentRange}
                initialStep={currentStep}
                onPlot={plotFunction}
                onSave={saveFunction}
                loading={loading}
            />

            {error && <p className="error-message">{error}</p>}
            {loading && <p>Loading graph points...</p>}

            <FunctionGraph points={graphPoints} funcExpression={currentFunction} />

            <SavedFunctionsList
                key={savedFunctionsKey} // Use key to force re-render when a function is saved/deleted
                apiBaseUrl={API_BASE_URL}
                onPlotAgain={plotFunction}
                onDelete={deleteFunction}
            />
        </div>
    );
}

export default App;