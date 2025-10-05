import React, { useState } from 'react';
import './DataTableView.css';

function DataTableView({ graphData }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    if (graphData.length === 0) {
        return null; // Don't render if no data
    }

    return (
        <div className="data-table-view card">
            <h3 onClick={toggleCollapse} className="collapsible-header">
                Evaluated Points Data
                <span className="collapse-icon">{isCollapsed ? '&#9660;' : '&#9650;'}</span>
            </h3>
            {!isCollapsed && (
                <div className="table-content">
                    {graphData.map((func) => (
                        <div key={func.id} className="function-data-section">
                            <h4>
                                <span className="color-swatch" style={{ backgroundColor: func.color }}></span>
                                f(x) = {func.expression}
                            </h4>
                            <div className="table-scroll-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>X</th>
                                            <th>Y</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {func.points.map((point, index) => (
                                            <tr key={index}>
                                                <td>{point[0].toFixed(4)}</td>
                                                <td>{point[1].toFixed(4)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DataTableView;