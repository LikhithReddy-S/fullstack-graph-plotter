/* src/pages/Help.js (New Help page) */
import React from 'react';
import './Help.css'; // Page-specific styles if needed

function Help() {
    return (
        <div className="help-container">
            <header className="page-header">
                <h1>Help & Documentation</h1>
            </header>
            <section className="help-content card">
                <h2>Getting Started</h2>
                <p>
                    Welcome to the Advanced Function Plotter! This tool lets you input mathematical functions, plot them on a graph, and manage saved functions.
                </p>
                <h3>Plotting a Function</h3>
                <ol>
                    <li>Enter the function expression in the "f(x) =" field (e.g., <code>sin(x)</code>, <code>x^2</code>, <code>2*x + 1</code>).</li>
                    <li>Set the range (start to end) and step size for evaluation points.</li>
                    <li>Choose a line color.</li>
                    <li>Click "Add & Plot" to visualize it on the graph.</li>
                </ol>
                <h3>Saving Functions</h3>
                <p>After entering details, click "Save Function" to store it in the database for later use.</p>
                <h3>Viewing Saved Functions</h3>
                <p>In the "Saved Functions" section, you can "Plot Again" or "Delete" previously saved items.</p>
                <h3>Graph Controls</h3>
                <ul>
                    <li><strong>Zoom In/Out:</strong> Adjust the view scale around the center.</li>
                    <li><strong>Pan:</strong> Move the view left/right/up/down.</li>
                    <li><strong>Reset View:</strong> Return to default (-10 to 10 on both axes).</li>
                </ul>
                <h3>Data Table</h3>
                <p>Click the "Evaluated Points Data" header to expand/collapse the table showing x/y points for each plotted function.</p>
                <h3>Troubleshooting</h3>
                <ul>
                    <li>If plotting fails, check the expression for syntax errors (supports basic math like +, -, *, /, ^, sin, cos, etc.).</li>
                    <li>Ensure the backend server is running on localhost:5000.</li>
                    <li>For large ranges or small steps, evaluation may take longer.</li>
                </ul>
                <p>Need more help? Check the <a href="/examples">Examples</a> page or contact us via the <a href="/about">About</a> page.</p>
            </section>
        </div>
    );
}

export default Help;