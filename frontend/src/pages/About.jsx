/* src/pages/About.js (New About page) */
import React from 'react';
import './About.css'; // Page-specific styles if needed

function About() {
    return (
        <div className="about-container">
            <header className="page-header">
                <h1>About Advanced Function Plotter</h1>
            </header>
            <section className="about-content card">
                <p>
                    This application allows users to plot mathematical functions interactively. 
                    Features include plotting multiple functions, zooming and panning the graph, 
                    saving functions to a database, and viewing evaluated data points.
                </p>
                <h2>Key Features</h2>
                <ul>
                    <li>Input and plot custom functions (e.g., sin(x), x^2)</li>
                    <li>Adjust range, step size, and line colors</li>
                    <li>Save and load functions from backend storage</li>
                    <li>Interactive canvas-based graphing with grid and axes</li>
                    <li>Data table view for points</li>
                </ul>
                <h2>Technologies</h2>
                <ul>
                    <li>Frontend: React.js with Canvas API</li>
                    <li>Backend: Assumed Node.js/Express with MongoDB (based on API endpoints)</li>
                    <li>No external charting libraries for pure custom implementation</li>
                </ul>
                <p>
                    Built for educational and exploratory purposes. Contributions welcome!
                </p>
            </section>
        </div>
    );
}

export default About;