const express = require('express');
const os = require('os');
const WebSocket = require('ws');
const pidusage = require('pidusage');
const si = require('systeminformation');

const app = express();
const PORT = process.env.PORT || 3000;
let lastReceived = 0;
let lastSent = 0;
let lastTotal = 0;

let statsHistory = [];

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
async function getNetworkStats() {
    // Retrieve memory and CPU utilization
    const pidStats = await getProcessStats();
    const memoryUtilization = pidStats.memory / (1024 * 1024); // Convert memory to MB
    const cpuUtilization = pidStats.cpu;

    // Retrieve network statistics using systeminformation
    let networkStats;
    try {
        networkStats = await si.networkStats();
    } catch (error) {
        console.error('Error retrieving network stats:', error);
        return { error: 'Internal server error' };
    }

    // Function to retrieve MAC and IP addresses
    async function getMACAndIPAddresses() {
        const interfaces = os.networkInterfaces();
        const macAndIPAddresses = {};

        Object.keys(interfaces).forEach(ifaceName => {
            const iface = interfaces[ifaceName];
            const ipv4Interfaces = iface.filter(iface => iface.family === 'IPv4' && !iface.internal);
            if (ipv4Interfaces.length > 0) {
                const ifaceStats = ipv4Interfaces[0];
                const { address, mac } = ifaceStats;
                macAndIPAddresses[ifaceName] = { address, mac };
            }
        });

        return macAndIPAddresses;
    }

    // Retrieve MAC and IP addresses
    const macAndIPAddresses = await getMACAndIPAddresses();

    const stats = {};

    // Iterate over network interfaces and calculate statistics
    networkStats.forEach(iface => {
        const ifaceName = iface.iface;
        const macAndIP = macAndIPAddresses[ifaceName];
        if (macAndIP) { // Check if the MAC and IP information exists
            const { address, mac } = macAndIP;
            const bytesReceived = iface.rx_bytes;
            const bytesSent = iface.tx_bytes;
            const bytesTotal = bytesReceived + bytesSent;
    
            const newReceived = bytesReceived - lastReceived;
            const newSent = bytesSent - lastSent;
            const newTotal = bytesTotal - lastTotal;
    
            const mbNewReceived = newReceived / 1024 / 1024;
            const mbNewSent = newSent / 1024 / 1024;
            const mbNewTotal = newTotal / 1024 / 1024;
    
            stats[ifaceName] = {
                address: address,
                mac: mac,
                bytesReceived: mbNewReceived.toFixed(2),
                bytesSent: mbNewSent.toFixed(2),
                bytesTotal: mbNewTotal.toFixed(2)
            };
    
            lastReceived = bytesReceived;
            lastSent = bytesSent;
            lastTotal = bytesTotal;
        } else {
            console.warn(`No MAC and IP address information found for interface: ${ifaceName}`);
        }
    });
    

    stats.memoryUtilization = memoryUtilization.toFixed(2);
    stats.cpuUtilization = cpuUtilization.toFixed(2);

    statsHistory.push(stats);
    if (statsHistory.length > 10) {
        statsHistory.shift();
    }

    return stats;
}


// Start the Express server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Routes
app.get('/', async (req, res) => {
    const stats = await getNetworkStats();
    res.json(stats);
});

app.get('/history', (req, res) => {
    res.json(statsHistory);
});