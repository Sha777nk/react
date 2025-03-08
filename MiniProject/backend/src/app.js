const express = require('express');
const si = require('systeminformation');
const bodyParser = require('body-parser');
const { connectDB, getDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const cache = {
    systemStats: null,
    loadBalancerStats: null,
    cacheTime: 0
};

const CACHE_DURATION = 0.25 * 1000; // 1 second

// Middleware for CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Add a new route to handle adding new networks
app.post('/add-network', async (req, res) => {
    const { networkName, ip, mac } = req.body;
    if (!networkName || !ip || !mac) {
        return res.status(400).send('Missing required fields');
    }

    const db = getDB();
    if (!db) {
        return res.status(500).send('Database not connected');
    }

    const collection = db.collection('networks');

    await collection.insertOne({ networkName, ip, mac, stats: [] });
    res.status(201).send('Network added successfully');
});

// Add this route to your backend code
app.delete('/network/:networkId', async (req, res) => {
    const networkId = req.params.networkId;

    const db = getDB();
    if (!db) {
        return res.status(500).send('Database not connected');
    }
    const collection = db.collection('networks');
    const result = await collection.deleteOne({ networkName: networkId });

    if (result.deletedCount === 0) {
        return res.status(404).send('Network not found');
    }

    res.status(200).send('Network removed successfully');
});

// Fetch the list of all networks
app.get('/networks', async (req, res) => {
    const db = getDB();
    if (!db) {
        return res.status(500).send('Database not connected');
    }

    const collection = db.collection('networks');

    const networks = await collection.find({}, { projection: { networkName: 1 } }).toArray();
    res.json(networks.map(network => network.networkName));
});

// Function to retrieve system stats
async function getSystemStats() {
    if (Date.now() - cache.cacheTime < CACHE_DURATION && cache.systemStats) {
        return cache.systemStats;
    }

    const memoryInfo = await si.mem();
    const cpuInfo = await si.cpu();
    const cpuLoad = await si.currentLoad();

    const stats = {
        timestamp: new Date().toISOString(),
        memoryInfo: {
            total: (memoryInfo.total / (1024 * 1024)).toFixed(2) + ' MB',
            free: (memoryInfo.free / (1024 * 1024)).toFixed(2) + ' MB',
            used: (memoryInfo.used / (1024 * 1024)).toFixed(2) + ' MB',
            consumed: ((memoryInfo.used / memoryInfo.total) * 100).toFixed(2) + ' %',
        },
        cpuInfo: {
            manufacturer: cpuInfo.manufacturer,
            brand: cpuInfo.brand,
            speed: cpuInfo.speed + ' GHz',
            cores: cpuInfo.cores,
            consumption: cpuLoad.currentLoad.toFixed(2) + ' %',
        }
    };

    const db = getDB();
    if (!db) {
        throw new Error('Database not connected');
    }
    const collection = db.collection('networks');
    const networks = await collection.find().toArray();

    for (const network of networks) {
        const { networkName, ip, mac } = network;
        const networkStats = await si.networkStats(ip);
        stats[networkName] = {
            ip,
            mac,
            ...networkStats[0],
        };
        await collection.updateOne({ networkName }, { $push: { stats: stats[networkName] } });
    }

    cache.systemStats = stats;
    cache.cacheTime = Date.now();
    return stats;
}

// Function to retrieve load balancer stats
async function getLoadBalancerStats() {
    if (Date.now() - cache.cacheTime < CACHE_DURATION && cache.loadBalancerStats) {
        return cache.loadBalancerStats;
    }

    // Implement load balancer stats logic here (if applicable)

    const stats = {
        memoryUtilization: 'N/A',
        cpuUtilization: 'N/A'
    };

    cache.loadBalancerStats = stats;
    cache.cacheTime = Date.now();
    return stats;
}

// Start the Express server
const server = app.listen(PORT, async () => {
    await connectDB(); // Connect to MongoDB before starting the server
    console.log(`Server is running on http://localhost:${PORT}/`);
});

// Routes

// Fetch stats for a specific network
app.get('/network/:networkId', async (req, res) => {
    const networkId = req.params.networkId;

    const db = getDB();
    if (!db) {
        return res.status(500).send('Database not connected');
    }
    const collection = db.collection('networks');
    const network = await collection.findOne({ networkName: networkId });

    if (!network) {
        return res.status(404).send('Network not found');
    }

    const stats = await getSystemStats();
    res.json({ [networkId]: stats[networkId] });
});

app.get('/', async (req, res) => {
    const stats = await getSystemStats();
    res.json(stats);
});

app.get('/history', async (req, res) => {
    const db = getDB();
    if (!db) {
        return res.status(500).send('Database not connected');
    }

    const collection = db.collection('networks');

    const networks = await collection.find().toArray();
    res.json(networks);
});

// New routes to fetch detailed CPU and memory information

app.get('/cpu', async (req, res) => {
    try {
        const cpuInfo = await si.cpu();
        const cpuLoad = await si.currentLoad();
        res.json({
            manufacturer: cpuInfo.manufacturer,
            brand: cpuInfo.brand,
            speed: cpuInfo.speed + ' GHz',
            cores: cpuInfo.cores,
            consumption: cpuLoad.currentLoad.toFixed(2) + ' %',
        });
    } catch (error) {
        res.status(500).send('Error fetching CPU info');
    }
});

app.get('/memory', async (req, res) => {
    try {
        const memoryInfo = await si.mem();
        res.json({
            total: (memoryInfo.total / (1024 * 1024)).toFixed(2) + ' MB',
            free: (memoryInfo.free / (1024 * 1024)).toFixed(2) + ' MB',
            used: (memoryInfo.used / (1024 * 1024)).toFixed(2) + ' MB',
            consumed: ((memoryInfo.used / memoryInfo.total) * 100).toFixed(2) + ' %',
        });
    } catch (error) {
        res.status(500).send('Error fetching memory info');
    }
});

// Route to fetch load balancer stats
app.get('/load-balancer-stats', async (req, res) => {
    try {
        const stats = await getLoadBalancerStats();
        res.json(stats);
    } catch (error) {
        res.status(500).send('Error fetching load balancer stats');
    }
});
