const express = require('express');
const router = express.Router();
const userService = require('../userManagement/userService');
const auth = require('../middleware/auth');
const {userValidationRules} = require('../validators/userValidator');
const {loginValidationRules} = require('../validators/userValidator');
const validate = require('../middleware/validate');

router.get('/users', userService.getAllUsers);
router.post('/register', userValidationRules(), validate,userService.registerUser);
router.post('/login', loginValidationRules(), validate, userService.loginUser);
router.get('/verify-token', auth.verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token valid' });
});

module.exports = router;
