import { useState, useEffect } from 'react';
import { fetchSheetData, getMockData } from '../services/api';

export const useDashboardData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await fetchSheetData();
                setData(result);
                setError(null);
            } catch (err) {
                console.error("Failed to load live data, using mock fallback...", err);
                // Fallback to mock data if live fetch fails (e.g. CORS or Private sheet)
                setData(getMockData());
                setError(err.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        loadData();

        // Refresh every 60 seconds
        const interval = setInterval(loadData, 60000);
        return () => clearInterval(interval);
    }, []);

    return { data, loading, error };
};
