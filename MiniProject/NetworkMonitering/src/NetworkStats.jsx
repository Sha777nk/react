// import React, { useState, useEffect } from 'react';

// function NetworkStats() {
//     const [stats, setStats] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('http://localhost:3000/');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch network statistics');
//                 }
//                 const data = await response.json();
//                 setStats(data);
//                 setError(null);
//             } catch (error) {
//                 setError(error.message);
//                 setStats(null);
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
    
//                 <div className="card-container p-6 rounded-lg shadow-lg bg-white">
//                     <h1 className='font-bold text-2xl mb-4'>Network Statistics</h1>
//                     {error && <p className="text-red-500">Error: {error}</p>}
//                     {stats && (
//                         <div>
//                             <div className="grid grid-cols-2 gap-4 mb-8">
//           <div className="card-container p-6 rounded-lg shadow-lg bg-white">
//             <h2 className="font-bold text-lg mb-4">Network Information</h2>
//             <table className="table-auto">
//               <tbody>
//                 <tr>
//                   <td className="px-4 py-2">Timestamp</td>
//                   <td className="px-4 py-2">{stats.timestamp}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2">Network IP</td>
//                   <td className="px-4 py-2">{stats['my network'].ip}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2">Network MAC</td>
//                   <td className="px-4 py-2">{stats['my network'].mac}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
        
//           <div className="card-container p-6 rounded-lg shadow-lg bg-white">
//             <h2 className="font-bold text-lg mb-4">Interface Details</h2>
//             <table className="table-auto">
//               <tbody>
//                 <tr>
//                   <td className="px-4 py-2">Interface</td>
//                   <td className="px-4 py-2">{stats['my network'].iface}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2">Operational State</td>
//                   <td className="px-4 py-2">{stats['my network'].operstate}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2">Network Initiated</td>
//                   <td className="px-4 py-2">{stats['my network'].ms} msec</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-2 gap-4 mb-8">
//           <div className="card-container p-6 rounded-lg shadow-lg bg-white">
//             <h2 className="font-bold text-lg mb-4">Transmission Statistics</h2>
//             <table className="table-auto">
//               <tbody>
//                 <tr>
//                   <td className="px-4 py-2">Transmitted Bytes</td>
//                   <td className="px-4 py-2">{stats['my network'].tx_bytes}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2">Outgoing Bytes/Sec</td>
//                   <td className="px-4 py-2">{stats['my network'].tx_sec}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2">Transmitted Dropped</td>
//                   <td className="px-4 py-2">{stats['my network'].tx_dropped}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2">Transmitted Errors</td>
//                   <td className="px-4 py-2">{stats['my network'].tx_errors}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
        
//           <div className="card-container p-6 rounded-lg shadow-lg bg-white">
//             <h2 className="font-bold text-lg mb-4">Reception Statistics</h2>
//             <table className="table-auto">
//               <tbody>
//                 <tr>
//                   <td className="px-4 py-2">Received Bytes</td>
//                   <td className="px-4 py-2">{stats['my network'].rx_bytes}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2">Incoming Bytes/Sec</td>
//                   <td className="px-4 py-2">{stats['my network'].rx_sec}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2">Received Dropped</td>
//                   <td className="px-4 py-2">{stats['my network'].rx_dropped}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2">Received Errors</td>
//                   <td className="px-4 py-2">{stats['my network'].rx_errors}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>                    
//                         </div>
//                     )}
//                 </div>
//     );
// }

// export default NetworkStats;





import React, { useState, useEffect } from 'react';

function NetworkStats() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isSubscribed = true;

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/');
                if (!response.ok) {
                    throw new Error('Failed to fetch network statistics');
                }
                const data = await response.json();
                if (isSubscribed) {
                    // Filter out memoryInfo and cpuInfo
                    const filteredData = Object.keys(data)
                        .filter(key => key !== 'memoryInfo' && key !== 'cpuInfo')
                        .reduce((obj, key) => {
                            obj[key] = data[key];
                            return obj;
                        }, {});
                    
                    setStats(filteredData);
                    setError(null);
                }
            } catch (error) {
                if (isSubscribed) {
                    setError(error.message);
                    setStats(null);
                }
            }
        };

        fetchData(); // Fetch data immediately on mount
        const intervalId = setInterval(fetchData, 1000);

        // Cleanup function to prevent memory leaks
        return () => {
            isSubscribed = false;
            clearInterval(intervalId);
        };
    }, []);

    const renderNetworkStats = (networkStats) => {
        if (!networkStats) return <p>No data available</p>;

        return (
            <div>
                <div className="card-container p-6 rounded-lg shadow-lg bg-white mt-6">
                    <h2 className="font-bold text-lg mb-4">Network Information</h2>
                    <table className="table-auto">
                        <tbody>
                            <tr>
                                <td className="px-4 py-2">Network IP</td>
                                <td className="px-4 py-2">{networkStats.ip || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2">Network MAC</td>
                                <td className="px-4 py-2">{networkStats.mac || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2">Timestamp</td>
                                <td className="px-4 py-2">{stats.timestamp}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="card-container p-6 rounded-lg shadow-lg bg-white mt-6">
                    <h2 className="font-bold text-lg mb-4">Interface Details</h2>
                    <table className="table-auto">
                        <tbody>
                            <tr>
                                <td className="px-4 py-2">Interface</td>
                                <td className="px-4 py-2">{networkStats.iface || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2">Operational State</td>
                                <td className="px-4 py-2">{networkStats.operstate || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2">Network Initiated</td>
                                <td className="px-4 py-2">{networkStats.ms || 'N/A'} msec</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 mt-6">
                    <div className="card-container p-6 rounded-lg shadow-lg bg-white">
                        <h2 className="font-bold text-lg mb-4">Transmission Statistics</h2>
                        <table className="table-auto">
                            <tbody>
                                <tr>
                                    <td className="px-4 py-2">Transmitted Bytes</td>
                                    <td className="px-4 py-2">{networkStats.tx_bytes || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Outgoing Bytes/Sec</td>
                                    <td className="px-4 py-2">{networkStats.tx_sec || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Transmitted Dropped</td>
                                    <td className="px-4 py-2">{networkStats.tx_dropped || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Transmitted Errors</td>
                                    <td className="px-4 py-2">{networkStats.tx_errors || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="card-container p-6 rounded-lg shadow-lg bg-white">
                        <h2 className="font-bold text-lg mb-4">Reception Statistics</h2>
                        <table className="table-auto">
                            <tbody>
                                <tr>
                                    <td className="px-4 py-2">Received Bytes</td>
                                    <td className="px-4 py-2">{networkStats.rx_bytes || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Incoming Bytes/Sec</td>
                                    <td className="px-4 py-2">{networkStats.rx_sec || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Received Dropped</td>
                                    <td className="px-4 py-2">{networkStats.rx_dropped || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Received Errors</td>
                                    <td className="px-4 py-2">{networkStats.rx_errors || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="card-container p-6 rounded-lg shadow-lg bg-white">
            <h1 className="font-bold text-2xl mb-4">Network Statistics</h1>
            {error && <p className="text-red-500">Error: {error}</p>}
            {stats ? (
                Object.keys(stats).map((networkName) => (
                    networkName !== 'timestamp' && (
                        <div key={networkName}>
                            <h2 className="font-bold text-xl mb-4">{networkName}</h2>
                            {renderNetworkStats(stats[networkName])}
                        </div>
                    )
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default NetworkStats;


