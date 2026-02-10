import React, { useState, useMemo, useEffect } from 'react';
import KPICard from './KPICard';
import ChartWidget from './ChartWidget';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ComposedChart, Line, Legend, LineChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel" style={{ padding: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.8)' }}>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ margin: '4px 0 0', fontWeight: 'bold', color: entry.color }}>
                        {entry.name}: {entry.value}
                        {entry.unit}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const ProjectDashboard = ({ data }) => {
    // 1. Get unique Projects
    const projects = useMemo(() => {
        if (!data) return [];
        return [...new Set(data.map(item => item.Project).filter(Boolean))].sort();
    }, [data]);

    const [selectedProject, setSelectedProject] = useState(projects[0] || null);

    useEffect(() => {
        if (!projects.length) {
            setSelectedProject(null);
            return;
        }

        if (!selectedProject || !projects.includes(selectedProject)) {
            setSelectedProject(projects[0]);
        }
    }, [projects, selectedProject]);

    // 2. Filter Data for Selected Project
    const filteredData = useMemo(() => {
        if (!data || !selectedProject) return [];
        // Filter by project
        const projData = data.filter(item => item.Project === selectedProject);

        // Aggregate by Month (combining multiple employees on same project)
        const grouped = projData.reduce((acc, curr) => {
            const month = curr.Month;
            if (!acc[month]) {
                acc[month] = {
                    Month: month,
                    Chats: 0,
                    Leads: 0,
                    FRT_Sum: 0,
                    FRT_Count: 0,
                    'Poor Leads': 0,
                    'Missed Chats': 0
                };
            }
            acc[month].Chats += Number(curr.Chats) || 0;
            acc[month].Leads += Number(curr.Leads) || 0;
            acc[month].FRT_Sum += Number(curr.FRT) || 0;
            acc[month].FRT_Count += 1;
            acc[month]['Poor Leads'] += Number(curr['Poor Leads']) || 0;
            acc[month]['Missed Chats'] += Number(curr['Missed Chats']) || 0;
            return acc;
        }, {});

        return Object.values(grouped).map(item => ({
            ...item,
            FRT: item.FRT_Count ? (item.FRT_Sum / item.FRT_Count).toFixed(0) : 0,
            Conversion: item.Chats ? ((item.Leads / item.Chats) * 100).toFixed(1) : 0 // Recalculate conversion
        }));

    }, [data, selectedProject]);

    // 3. Calculate KPIS (Grand Totals for Selected Project)
    const metrics = useMemo(() => {
        if (!data || !selectedProject) return null;

        // Use raw filtered data (before month aggregation) for max precision
        const rawProjData = data.filter(item => item.Project === selectedProject);

        let totalChats = 0;
        let totalLeads = 0;
        let totalMissed = 0;
        let totalPoor = 0;
        let totalFRT = 0;
        let countFRT = 0;

        rawProjData.forEach(row => {
            totalChats += Number(row.Chats) || 0;
            totalLeads += Number(row.Leads) || 0;
            totalMissed += Number(row['Missed Chats']) || 0;
            totalPoor += Number(row['Poor Leads']) || 0;
            if (row.FRT) {
                // Ensure FRT is a valid number before adding
                const val = Number(row.FRT);
                if (!isNaN(val)) {
                    totalFRT += val;
                    countFRT++;
                }
            }
        });

        const avgConversion = totalChats > 0 ? ((totalLeads / totalChats) * 100).toFixed(0) : 0;
        const avgFRT = countFRT > 0 ? (totalFRT / countFRT).toFixed(0) : 0;

        return {
            chats: { value: totalChats, change: null },
            leads: { value: totalLeads, change: null },
            conversion: { value: avgConversion, change: null },
            frt: { value: avgFRT, change: null },
            missed: { value: totalMissed, change: null },
            poorLeads: { value: totalPoor, change: null }
        };
    }, [data, selectedProject]);


    if (!data) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', height: '100%', gap: '20px' }}>

            {/* Sidebar List */}
            <div className="glass-panel" style={{ width: '250px', display: 'flex', flexDirection: 'column', padding: '10px', height: 'fit-content', maxHeight: '100%', overflowY: 'auto' }}>
                <h3 style={{ color: 'var(--secondary-neon)', padding: '0 10px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Current Projects</h3>
                {projects.map(proj => (
                    <div
                        key={proj}
                        onClick={() => setSelectedProject(proj)}
                        style={{
                            padding: '12px 15px',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            background: selectedProject === proj ? 'rgba(188, 19, 254, 0.1)' : 'transparent', // Using secondary neon color tint
                            borderLeft: selectedProject === proj ? '3px solid var(--secondary-neon)' : '3px solid transparent',
                            color: selectedProject === proj ? '#fff' : 'var(--text-muted)',
                            transition: 'all 0.2s ease',
                            marginBottom: '4px'
                        }}
                    >
                        {proj}
                    </div>
                ))}
            </div>

            {/* Main Content (Reused Logic) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* KPI Grid */}
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <KPICard
                        title="Total Chats"
                        value={metrics?.chats.value}
                        change={metrics?.chats.change}
                        format="number"
                    />
                    <KPICard
                        title="Total Leads"
                        value={metrics?.leads.value}
                        change={metrics?.leads.change}
                        format="number"
                    />
                    <KPICard
                        title="Conversion Rate"
                        value={metrics?.conversion.value}
                        change={metrics?.conversion.change}
                        suffix="%"
                        format="percent"
                    />
                    <KPICard
                        title="Avg Response (FRT)"
                        value={metrics?.frt.value}
                        change={metrics?.frt.change}
                        format="number"
                        suffix="s"
                        invert={true}
                    />
                    <KPICard
                        title="Missed Chats"
                        value={metrics?.missed.value}
                        change={metrics?.missed.change}
                        format="number"
                        invert={true}
                    />
                    <KPICard
                        title="Poor Leads"
                        value={metrics?.poorLeads.value}
                        change={metrics?.poorLeads.change}
                        format="number"
                        invert={true}
                    />
                </div>

                {/* Charts Grid */}
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))' }}>

                    {/* Chart 1: Chats & Leads (Combo: Bar + Line) */}
                    <div className="chart-widget wide">
                        <ChartWidget title="Volume: Chats vs Leads">
                            <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="Month" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="Chats" name="Chats" fill="var(--primary-neon)" radius={[4, 4, 0, 0]} barSize={30} />
                                <Line type="monotone" dataKey="Leads" name="Leads" stroke="var(--secondary-neon)" strokeWidth={3} dot={{ r: 4, fill: 'var(--secondary-neon)' }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ChartWidget>
                    </div>

                    {/* Chart 2: Conversion % (Line Chart) */}
                    <div className="chart-widget">
                        <ChartWidget title="Conversion Trend">
                            <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="Month" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="Conversion" name="Conversion %" stroke="var(--accent-neon)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-neon)' }} activeDot={{ r: 6 }} unit="%" />
                            </LineChart>
                        </ChartWidget>
                    </div>

                    {/* Chart 3: FRT & Chats (Dual Axis: Composed) */}
                    <div className="chart-widget">
                        <ChartWidget title="Impact: FRT vs Volume">
                            <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="Month" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="left" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} unit="s" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="Chats" name="Chats" fill="rgba(57, 255, 20, 0.3)" radius={[4, 4, 0, 0]} barSize={40} />
                                <Line yAxisId="right" dataKey="FRT" name="FRT (s)" stroke="#FFD700" strokeWidth={3} dot={{ r: 4, fill: '#FFD700' }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ChartWidget>
                    </div>

                    {/* Chart 4: Poor Leads & Missed Chats (Stacked Bar) */}
                    <div className="chart-widget">
                        <ChartWidget title="Quality Drawbacks">
                            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="Month" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="Poor Leads" name="Poor Leads" stackId="a" fill="#ff9900" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Missed Chats" name="Missed Chats" stackId="a" fill="var(--error-neon)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartWidget>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDashboard;
