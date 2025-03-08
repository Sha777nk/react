const mongoose = require('mongoose');

const networkSchema = new mongoose.Schema({
    networkName: { type: String, required: true },
    ip: { type: String, required: true },
    mac: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stats: { type: Array, default: [] }
});

module.exports = mongoose.model('Network', networkSchema);
