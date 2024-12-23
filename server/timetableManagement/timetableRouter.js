const express = require('express');
const router = express.Router();
const timetableService = require('../timetableManagement/timetableService');

router.post('/saveTimetable', timetableService.saveSchedule);
router.get('/loadTimetable/:userId', timetableService.loadSchedule);
router.post('/deleteSubject', timetableService.deleteSubject);

module.exports = router;

