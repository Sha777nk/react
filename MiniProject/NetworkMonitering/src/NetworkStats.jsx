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
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Interface Name</th>
                            <th className="px-4 py-2">Bytes Sent</th>
                            <th className="px-4 py-2">Bytes Received</th>
                            <th className="px-4 py-2">Total Bytes</th>
                            <th className="px-4 py-2">Date and Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(stats).map(ifaceName => {
                            // Check if the current key is not memoryUtilization, cpuUtilization, timestamp, or _id
                            if (ifaceName !== 'memoryUtilization' && ifaceName !== 'cpuUtilization' && ifaceName !== 'timestamp' && ifaceName !== '_id') {
                                return (
                                    <tr key={ifaceName} className="mb-4">
                                        <td className="border px-4 py-2">{ifaceName}</td>
                                        <td className="border px-4 py-2">{stats[ifaceName].bytesSent}</td>
                                        <td className="border px-4 py-2">{stats[ifaceName].bytesReceived}</td>
                                        <td className="border px-4 py-2">{stats[ifaceName].bytesTotal}</td>
                                        <td className="border px-4 py-2">{stats.timestamp}</td>
                                    </tr>
                                );
                            }
                            return null; // Skip rendering if it's memoryUtilization, cpuUtilization, timestamp, or _id
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default NetworkStats;
