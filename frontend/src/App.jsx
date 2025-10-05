// src/App.js (Updated with more routes)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Help from './pages/Help';
import Examples from './pages/Examples';
import './App.css'; // Assuming global styles

function App() {
    return (
        <Router>
            <div className="app-wrapper">
                <nav className="navbar">
                    <ul className="nav-links">
                        <li><Link to="/">Home (Plotter)</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/help">Help</Link></li>
                        <li><Link to="/examples">Examples</Link></li>
                    </ul>
                </nav>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/examples" element={<Examples />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;