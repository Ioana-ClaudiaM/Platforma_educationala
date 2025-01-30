const express = require('express');
const router = express.Router();
const tasksService = require('../tasksManagement/tasksService');  
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { tasksValidationRules } = require('../validators/tasksValidator');

router.get('/tasks/:userId/:eventId', auth.verifyToken, validate, tasksService.loadTasks , (req,res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.get('/tasks/:userId', auth.verifyToken, validate, tasksService.loadAllTasks, (req,res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.post('/addTask', auth.verifyToken, tasksValidationRules(), validate, tasksService.saveTask, (req, res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.put('/updateTask', auth.verifyToken, tasksValidationRules(), validate, tasksService.updateTask, (req, res) => {
    res.status(200).json({ message: 'Token valid' });
});

router.delete('/deleteTask/:userId/:eventId/:taskId', auth.verifyToken, validate, tasksService.deleteTask, (req, res) => {
    res.status(200).json({ message: 'Token valid' });
});

module.exports = router;
