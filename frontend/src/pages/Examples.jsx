/* src/pages/Examples.js (New Examples page) */
import React from 'react';
import './Examples.css'; // Page-specific styles if needed

function Examples() {
    const examples = [
        {
            expression: 'x^2',
            description: 'Quadratic function - a parabola opening upwards.',
            range: '[-5, 5]',
            step: '0.1'
        },
        {
            expression: 'sin(x)',
            description: 'Sine wave - periodic oscillation.',
            range: '[0, 2*pi]',
            step: '0.05'
        },
        {
            expression: 'cos(x)',
            description: 'Cosine wave - similar to sine but phase-shifted.',
            range: '[0, 2*pi]',
            step: '0.05'
        },
        {
            expression: 'e^x',
            description: 'Exponential growth.',
            range: '[-2, 3]',
            step: '0.1'
        },
        {
            expression: 'ln(x)',
            description: 'Natural logarithm - defined for x > 0.',
            range: '[0.1, 5]',
            step: '0.1'
        },
        {
            expression: '1/x',
            description: 'Hyperbola - asymptotes at x=0 and y=0.',
            range: '[-5, -0.1] U [0.1, 5]',
            step: '0.1'
        }
    ];

    return (
        <div className="examples-container">
            <header className="page-header">
                <h1>Function Examples</h1>
                <p>Try these common functions in the plotter on the <a href="/">Home</a> page!</p>
            </header>
            <section className="examples-content card">
                <ul className="examples-list">
                    {examples.map((ex, index) => (
                        <li key={index} className="example-item">
                            <h3>f(x) = {ex.expression}</h3>
                            <p>{ex.description}</p>
                            <p><strong>Suggested Range:</strong> {ex.range} | <strong>Step:</strong> {ex.step}</p>
                        </li>
                    ))}
                </ul>
                <div className="examples-note">
                    <p>Note: For multi-part ranges like the hyperbola, plot in segments separately.</p>
                    <p>Head back to the <a href="/">plotter</a> to experiment!</p>
                </div>
            </section>
        </div>
    );
}

export default Examples;