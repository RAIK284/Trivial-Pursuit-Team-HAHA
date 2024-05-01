const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.createUser);
router.post('/login-user', userController.loginUser);
router.post('/fetch-username', userController.fetchUsername);

module.exports = router;
