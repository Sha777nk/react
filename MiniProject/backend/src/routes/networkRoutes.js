const express = require('express');
const networkController = require('../controllers/networkController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, networkController.addNetwork);
router.get('/', authMiddleware, networkController.getNetworks);
router.get('/:networkId', authMiddleware, networkController.getNetworkStats);

module.exports = router;
