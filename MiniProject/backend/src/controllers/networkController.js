const Network = require('../models/network');
const si = require('systeminformation');

exports.addNetwork = async (req, res) => {
    const { networkName, ip, mac } = req.body;
    const userId = req.user._id;

    try {
        const network = new Network({ networkName, ip, mac, userId });
        await network.save();
        res.status(201).send('Network added successfully');
    } catch (error) {
        res.status(400).send('Error adding network: ' + error.message);
    }
};

exports.getNetworks = async (req, res) => {
    const userId = req.user._id;

    try {
        const networks = await Network.find({ userId }, { networkName: 1 });
        res.json(networks.map(network => network.networkName));
    } catch (error) {
        res.status(400).send('Error fetching networks: ' + error.message);
    }
};

exports.getNetworkStats = async (req, res) => {
    const { networkId } = req.params;
    const userId = req.user._id;

    try {
        const network = await Network.findOne({ networkName: networkId, userId });
        if (!network) {
            return res.status(404).send('Network not found');
        }

        const networkStats = await si.networkStats(network.ip);
        res.json({ networkName: network.networkName, ip: network.ip, mac: network.mac, stats: networkStats[0] });
    } catch (error) {
        res.status(400).send('Error fetching network stats: ' + error.message);
    }
};
