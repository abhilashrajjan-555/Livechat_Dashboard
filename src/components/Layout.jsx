import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <h1 style={{
                    color: 'var(--primary-neon)',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontSize: '1.5rem',
                    margin: 0
                }}>
                    Xtreme Online Solutions - <span style={{ color: '#fff' }}>Performance Dashboard 2025</span>
                </h1>
                <div className="status-indicator" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-neon)', boxShadow: '0 0 8px var(--accent-neon)' }}></div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ONLINE</span>
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
