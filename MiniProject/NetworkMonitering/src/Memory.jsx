import React, { useState, useEffect } from 'react';

function Memory() {
    const [memoryUtilization, setMemoryUtilization] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/');
                if (!response.ok) {
                    throw new Error('Failed to fetch memory utilization');
                }
                const data = await response.json();
                setMemoryUtilization(data.memoryUtilization);
                setError(null);
            } catch (error) {
                setError(error.message);
                setMemoryUtilization(null);
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
        <div className="card-container p-6 rounded-lg shadow-lg bg-white text-center">
            <h1 className='font-bold text-2xl mb-4'>RAM Utilization</h1>
            {error && <p className="text-red-500">Error: {error}</p>}
            {memoryUtilization !== null ? (
                <p className="text-4xl">{memoryUtilization !== undefined ? memoryUtilization + ' MB' : 'N/A'}</p>
            ) : (
                <p className="text-4xl">Loading...</p>
            )}
        </div>
    );
}

export default Memory;

