// import React, { useState, useEffect } from 'react';

// function Cpu() {
//     const [cpuUtilization, setCpuUtilization] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('http://localhost:3000/');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch CPU utilization');
//                 }
//                 const data = await response.json();
//                 setCpuUtilization(data.cpuUtilization);
//                 setError(null);
//             } catch (error) {
//                 setError(error.message);
//                 setCpuUtilization(null);
//             }
//         };

//         // Fetch data initially
//         fetchData();

//         // Fetch data every second
//         const interval = setInterval(fetchData, 1000);

//         // Cleanup function to clear interval when component unmounts
//         return () => clearInterval(interval);
//     }, []); // Empty dependency array ensures this effect runs only once on component mount

//     return (
//         <div className="card-container p-6 rounded-lg shadow-lg bg-white text-center">
//             <h1 className='font-bold text-2xl mb-4'>CPU Utilization</h1>
//             {error && <p className="text-red-500">Error: {error}</p>}
//             {cpuUtilization !== null ? (
//                 <p className="text-4xl">{cpuUtilization !== undefined ? cpuUtilization + '%' : 'N/A'}</p>
//             ) : (
//                 <p className="text-4xl">Loading...</p>
//             )}
//         </div>
//     );
// }

// export default Cpu;


import React, { useState, useEffect } from 'react';

function Cpu() {
    const [cpuInfo, setCpuInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/cpu');
                if (!response.ok) {
                    throw new Error('Failed to fetch CPU information');
                }
                const data = await response.json();
                setCpuInfo(data);
                setError(null);
            } catch (error) {
                setError(error.message);
                setCpuInfo(null);
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
            <h1 className='font-bold text-2xl mb-4'>CPU Information</h1>
            {error && <p className="text-red-500">Error: {error}</p>}
            {cpuInfo !== null ? (
                <div>
                    <p><strong>Manufacturer:</strong> {cpuInfo.manufacturer}</p>
                    <p><strong>Brand:</strong> {cpuInfo.brand}</p>
                    <p><strong>Speed:</strong> {cpuInfo.speed}</p>
                    <p><strong>Cores:</strong> {cpuInfo.cores}</p>
                    <p><strong>Consumption:</strong> {cpuInfo.consumption}</p>
                </div>
            ) : (
                <p className="text-4xl">Loading...</p>
            )}
        </div>
    );
}

export default Cpu;

