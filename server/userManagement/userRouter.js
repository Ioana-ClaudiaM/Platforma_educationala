const express = require('express');
const router = express.Router();
const userService = require('../userManagement/userService');
const auth = require('../middleware/auth');

router.get('/users', userService.getAllUsers);
router.post('/register', userService.registerUser);
router.post('/login', userService.loginUser);
router.get('/verify-token', auth.verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token valid' });
});

module.exports = router;
