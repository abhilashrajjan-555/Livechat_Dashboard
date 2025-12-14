import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import classNames from 'classnames';

const KPICard = ({ title, value, change, format = 'number', prefix = '', suffix = '', invert = false }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    // If invert is true, positive change is bad (red), negative change is good (green)
    const isGood = invert ? isNegative : isPositive;
    const isBad = invert ? isPositive : isNegative;

    return (
        <div className="glass-panel kpi-card">
            <div className="kpi-title">{title}</div>
            <div className="kpi-value">
                {prefix}{value}{suffix}
            </div>
            {(change !== undefined && change !== null) && (
                <div className={classNames('kpi-change', {
                    'change-positive': isGood,
                    'change-negative': isBad,
                    'change-neutral': !isGood && !isBad
                })}>
                    {isPositive ? <ArrowUp size={16} /> : isNegative ? <ArrowDown size={16} /> : <Minus size={16} />}
                    <span>{Math.abs(change)}%</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>vs last month</span>
                </div>
            )}
        </div>
    );
};

export default KPICard;
