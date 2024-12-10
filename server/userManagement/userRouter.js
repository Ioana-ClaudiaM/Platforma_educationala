const express = require('express')
const router = express.Router();
const userService = require('../userManagement/userService')

router.get('/users', userService.getAllUsers);
router.post('/register',userService.registerUser);
module.exports = router