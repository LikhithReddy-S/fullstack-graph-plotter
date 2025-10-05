import React, { useState, useEffect, useCallback } from 'react';
import './SavedFunctionsList.css';

function SavedFunctionsList({ apiBaseUrl, onPlotAgain, onDelete }) {
    const [savedFunctions, setSavedFunctions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSavedFunctions = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${apiBaseUrl}/list`);
            if (!response.ok) {
                throw new Error('Failed to fetch saved functions.');
            }
            const data = await response.json();
            setSavedFunctions(data);
        } catch (err) {
            console.error('Fetch saved functions error:', err);
            setError(err.message || 'Could not load saved functions.');
        } finally {
            setLoading(false);
        }
    }, [apiBaseUrl]);

    useEffect(() => {
        fetchSavedFunctions();
    }, [fetchSavedFunctions]);

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this function?')) {
            await onDelete(id);
            // After successful deletion, re-fetch the list to update UI
            fetchSavedFunctions();
        }
    };

    const handlePlotAgainClick = (func) => {
        onPlotAgain(func.expression, [func.range_start, func.range_end], func.step);
        // Optionally scroll to top or graph area after plotting
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <div className="saved-functions-list">Loading saved functions...</div>;
    }

    if (error) {
        return <div className="saved-functions-list error-message">{error}</div>;
    }

    return (
        <div className="saved-functions-list">
            <h2>Saved Functions</h2>
            {savedFunctions.length === 0 ? (
                <p>No functions saved yet.</p>
            ) : (
                <ul>
                    {savedFunctions.map((func) => (
                        <li key={func._id} className="saved-function-item">
                            <div className="function-details">
                                <strong>f(x) = {func.expression}</strong>
                                <span>
                                    Range: [{func.range_start}, {func.range_end}], Step: {func.step}
                                </span>
                                <span className="saved-date">
                                    Saved: {new Date(func.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="function-actions">
                                <button
                                    className="plot-again-button"
                                    onClick={() => handlePlotAgainClick(func)}
                                >
                                    Plot Again
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteClick(func._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SavedFunctionsList;