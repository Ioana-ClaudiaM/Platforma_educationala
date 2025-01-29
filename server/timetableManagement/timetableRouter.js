const express = require('express');
const router = express.Router();
const timetableService = require('../timetableManagement/timetableService');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {timetableValidationRules} = require('../validators/timetableValidators');

router.post('/saveTimetable', timetableValidationRules(),validate, auth.verifyToken, timetableService.saveSchedule , (req,res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.get('/loadTimetable/:userId', auth.verifyToken, timetableService.loadSchedule,(req, res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.delete('/deleteSubject/:userId/:day/:index', auth.verifyToken, timetableService.deleteSubject , (req,res) => {
    res.status(200).json({ message: 'Token valid' });
});

module.exports = router;

