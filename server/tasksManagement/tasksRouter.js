const express = require('express');
const router = express.Router();
const tasksService = require('../tasksManagement/tasksService');  

router.get('/tasks/:userId/:eventId', tasksService.loadTasks);
router.get('/tasks/:userId', tasksService.loadAllTasks);
router.post('/addTask', tasksService.saveTask);
router.put('/updateTask', tasksService.updateTask);
router.delete('/deleteTask/:userId/:eventId/:taskId', tasksService.deleteTask);
module.exports = router;
