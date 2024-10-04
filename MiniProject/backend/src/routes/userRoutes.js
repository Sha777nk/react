// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Import controller functions
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

// Define routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;


// const express = require('express');
// const userController = require('../controllers/userController');

// const router = express.Router();

// router.post('/register', userController.register);
// router.post('/login', userController.login);

// module.exports = router;
