import React, { useState, useEffect } from 'react';

function NetworkStats() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/');
                if (!response.ok) {
                    throw new Error('Failed to fetch network statistics');
                }
                const data = await response.json();
                setStats(data);
                setError(null);
            } catch (error) {
                setError(error.message);
                setStats(null);
            }
        };

        // Fetch data initially
        fetchData();

        // Fetch data every second
        const interval = setInterval(fetchData, 1000);

        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(interval);
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    return (
        <div className="card-container p-6 rounded-lg shadow-lg bg-white">
            <h1 className='font-bold text-2xl mb-4'>Network Statistics</h1>
            {error && <p className="text-red-500">Error: {error}</p>}
            {stats && (
                <ul>
                    {Object.keys(stats).map(ifaceName => {
    // Check if the current key is not memoryUtilization or cpuUtilization
    if (ifaceName !== 'memoryUtilization' && ifaceName !== 'cpuUtilization') {
        return (
            <li key={ifaceName} className="mb-4">
                <strong>IP Address:</strong> {stats[ifaceName].address}<br />
                <strong>MAC:</strong> {stats[ifaceName].mac}<br />
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Interface Name</th>
                            <th className="px-4 py-2">Bytes Sent</th>
                            <th className="px-4 py-2">Bytes Received</th>
                            <th className="px-4 py-2">Total Bytes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={ifaceName}>
                            <td className="border px-4 py-2">{ifaceName}</td>
                            <td className="border px-4 py-2">{stats[ifaceName].bytesSent}</td>
                            <td className="border px-4 py-2">{stats[ifaceName].bytesReceived}</td>
                            <td className="border px-4 py-2">{stats[ifaceName].bytesTotal}</td>
                        </tr>
                    </tbody>
                </table>
            </li>
        );
    }
    return null; // Skip rendering if it's memoryUtilization or cpuUtilization
})}
                </ul>
            )}
        </div>
    );
}

export default NetworkStats;
