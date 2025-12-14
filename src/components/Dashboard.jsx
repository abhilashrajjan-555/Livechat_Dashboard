import React, { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import CompanyDashboard from './CompanyDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import ProjectDashboard from './ProjectDashboard';

const Dashboard = () => {
    const { data, loading, error } = useDashboardData();
    const [activeTab, setActiveTab] = useState('company');

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--primary-neon)' }}>
                <h2 className="loading-pulse">Connecting to Neural Network...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-content">
                <div style={{ background: 'rgba(255, 0, 85, 0.2)', border: '1px solid var(--error-neon)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', color: '#fff' }}>
                    Error: Data stream interrupted. ({error})
                </div>
            </div>
        )
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* 1. Tab Navigation Bar */}
            <div className="tab-nav" style={{
                display: 'flex',
                gap: '2px',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '10px'
            }}>
                <button
                    onClick={() => setActiveTab('company')}
                    style={{ ...tabStyle, ...(activeTab === 'company' ? activeTabStyle : {}) }}
                >
                    Company Performance
                </button>
                <button
                    onClick={() => setActiveTab('employee')}
                    style={{ ...tabStyle, ...(activeTab === 'employee' ? activeTabStyle : {}) }}
                >
                    Employee Performance
                </button>
                <button
                    onClick={() => setActiveTab('project')}
                    style={{ ...tabStyle, ...(activeTab === 'project' ? activeTabStyle : {}) }}
                >
                    Project Performance
                </button>
            </div>

            {/* 2. Content Area */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {activeTab === 'company' && <CompanyDashboard data={data} />}
                {activeTab === 'employee' && <EmployeeDashboard data={data} />}
                {activeTab === 'project' && <ProjectDashboard data={data} />}
            </div>

        </div>
    );
};

// Simple inline styles for Tabs (Planning to verify visual first)
const tabStyle = {
    background: 'rgba(0,0,0,0.3)',
    border: 'none',
    color: 'var(--text-muted)',
    padding: '10px 20px',
    cursor: 'pointer',
    fontFamily: 'var(--font-primary)',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
    borderBottom: '2px solid transparent'
};

const activeTabStyle = {
    color: '#fff',
    borderBottom: '2px solid var(--primary-neon)',
    textShadow: '0 0 8px var(--primary-neon)'
};

export default Dashboard;
