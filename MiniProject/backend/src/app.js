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
//         <div className="card-container p-6 rounded-lg shadow-lg bg-white">
//             <h1 className='font-bold text-2xl mb-4'>Network Statistics</h1>
//             {error && <p className="text-red-500">Error: {error}</p>}
//             {stats && (
//                 <table className="table-auto w-full">
//                     <thead>
//                         <tr>
//                             <th className="px-4 py-2">Interface Name</th>
//                             <th className="px-4 py-2">Bytes Sent</th>
//                             <th className="px-4 py-2">Bytes Received</th>
//                             <th className="px-4 py-2">Total Bytes</th>
//                             <th className="px-4 py-2">Date and Time</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {Object.keys(stats).map(ifaceName => {
//                             // Check if the current key is not memoryUtilization, cpuUtilization, timestamp, or _id
//                             if (ifaceName !== 'memoryUtilization' && ifaceName !== 'cpuUtilization' && ifaceName !== 'timestamp' && ifaceName !== '_id') {
//                                 return (
//                                     <tr key={ifaceName} className="mb-4">
//                                         <td className="border px-4 py-2">{ifaceName}</td>
//                                         <td className="border px-4 py-2">{stats[ifaceName].bytesSent}</td>
//                                         <td className="border px-4 py-2">{stats[ifaceName].bytesReceived}</td>
//                                         <td className="border px-4 py-2">{stats[ifaceName].bytesTotal}</td>
//                                         <td className="border px-4 py-2">{stats.timestamp}</td>
//                                     </tr>
//                                 );
//                             }
//                             return null; // Skip rendering if it's memoryUtilization, cpuUtilization, timestamp, or _id
//                         })}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// }

// export default NetworkStats;









const express = require('express');
const os = require('os');
const WebSocket = require('ws');
const pidusage = require('pidusage');
const si = require('systeminformation');
const bodyParser = require('body-parser');
const { connectDB, getDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let networkData = {}; // In-memory store for network data

// Middleware for CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', function connection(ws) {
    console.log('WebSocket connected');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    ws.send('WebSocket connected');
});

// Add a new route to handle adding new networks
app.post('/add-network', async (req, res) => {
    const { networkName, ip, mac } = req.body;
    if (!networkName || !ip || !mac) {
        return res.status(400).send('Missing required fields');
    }

    // Add network details to the in-memory object or a database
    networkData[networkName] = { ip, mac, stats: [] }; // Assuming networkData is an object to store network details
    res.status(201).send('Network added successfully');
});

// Fetch the list of all networks
app.get('/networks', (req, res) => {
    res.json(Object.keys(networkData));
});

// Define getProcessStats function
async function getProcessStats() {
    return new Promise((resolve, reject) => {
        pidusage(process.pid, (err, stat) => {
            if (err) reject(err);
            else resolve(stat);
        });
    });
}

// Function to retrieve network stats
// Function to retrieve network stats
async function getNetworkStats() {
    const pidStats = await getProcessStats();
    const memoryUtilization = pidStats.memory / (1024 * 1024); // Convert memory to MB
    const cpuUtilization = pidStats.cpu;

    const stats = {
        timestamp: new Date().toISOString(),
        memoryUtilization: memoryUtilization.toFixed(2),
        cpuUtilization: cpuUtilization.toFixed(2),
    };

    for (const networkName in networkData) {
        const { ip, mac } = networkData[networkName];
        const networkStats = await si.networkStats(ip);
        stats[networkName] = {
            ip,
            mac,
            ...networkStats[0],
        };
        networkData[networkName].stats.push(stats[networkName]);
    }

    return stats;

}

// Start the Express server
const server = app.listen(PORT, async () => {
    await connectDB(); // Connect to MongoDB before starting the server
    console.log(`Server is running on http://localhost:${PORT}/`);
});

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Routes

// Fetch stats for a specific network
app.get('/network/:networkId', async (req, res) => {
    const networkId = req.params.networkId;
    if (!networkData[networkId]) {
        return res.status(404).send('Network not found');
    }
    
    const stats = await getNetworkStats();
    res.json({ [networkId]: stats[networkId] });
});

app.get('/', async (req, res) => {
    const stats = await getNetworkStats();
    res.json(stats);
});

app.get('/history', (req, res) => {
    res.json(networkData);
});
