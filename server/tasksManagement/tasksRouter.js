const express = require('express');
const router = express.Router();
const tasksService = require('../tasksManagement/tasksService');  

router.post('/addTask', tasksService.saveTask);
router.get('/tasks/:userId/:eventId', tasksService.loadTasks);
router.put('/updateTask', tasksService.updateTask);
router.delete('/deleteTask', tasksService.deleteTask);
router.get('/tasks/:userId', tasksService.loadAllTasks);
module.exports = router;
