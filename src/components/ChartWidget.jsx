import React from 'react';
import { ResponsiveContainer } from 'recharts';

/**
 * Clean wrapper component for charts consistent with the glassmorphism theme.
 * Now acts as a container for Recharts components passed as children.
 */
const ChartWidget = ({ title, children }) => {
    return (
        <div className="glass-panel chart-widget">
            <h3 className="kpi-title">{title}</h3>
            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartWidget;
