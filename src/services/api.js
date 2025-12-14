import Papa from 'papaparse';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS2uafhUW7vhD98eVrKfZcuKgqWU1Xpp9FUk27446b8WR_CCp2hOIIV9f7fNAybK2bSEDGAEJZjQQ_3/pub?output=csv';

export const fetchSheetData = async () => {
    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }
        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true, // Auto-convert numbers
                complete: (results) => {
                    if (results.errors.length) {
                        console.error('CSV Parsing Errors:', results.errors);
                    }

                    // Sanitize data: remove '%' and 's', then convert to numbers
                    const sanitizedData = results.data.map(row => {
                        const newRow = { ...row };
                        Object.keys(newRow).forEach(key => {
                            if (typeof newRow[key] === 'string') {
                                // Remove common non-numeric suffixes/prefixes
                                const cleanVal = newRow[key].replace(/[%,s]/g, '').trim();
                                // Try parsing if it looks like a number
                                if (!isNaN(cleanVal) && cleanVal !== '') {
                                    newRow[key] = parseFloat(cleanVal);
                                }
                            }
                        });
                        return newRow;
                    });

                    resolve(sanitizedData);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw error;
    }
};

/**
 * Mock data for testing when offline or if sheet fails
 */
export const getMockData = () => {
    // Generates granular data for aggregation testing
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const employees = ['Alice', 'Bob', 'Charlie', 'Diana'];
    const projects = ['Automotive', 'Merchandise', 'Real Estate'];

    let data = [];

    months.forEach(month => {
        employees.forEach(emp => {
            projects.forEach(proj => {
                // Randomize somewhat realistic values
                const chats = Math.floor(Math.random() * 50) + 20; // 20-70 chats
                const leads = Math.floor(chats * (Math.random() * 0.3 + 0.1)); // 10-40% conversion
                const conv = (leads / chats) * 100;
                const frt = Math.floor(Math.random() * 40) + 20; // 20-60s
                const poor = Math.floor(leads * 0.1);
                const missed = Math.floor(chats * 0.05);

                data.push({
                    Month: month,
                    Employee: emp,
                    Project: proj,
                    Chats: chats,
                    Leads: leads,
                    Conversion: conv.toFixed(1), // keep as string for CSV simulation
                    FRT: frt,
                    'Poor Leads': poor,
                    'Missed Chats': missed
                });
            });
        });
    });

    return data;
};
