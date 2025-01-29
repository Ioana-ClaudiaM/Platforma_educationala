const express = require('express');
const router = express.Router();
const gradesService = require('../gradesManagement/gradesService');

router.post('/saveSubjectGrades', gradesService.saveSubjectGrades);
router.get('/loadGrades/:userId', gradesService.loadGrades);
router.delete('/deleteSubjectGrade/:userId/:subjectName', gradesService.deleteSubjectGrade);
router.put('/updateSubjectGrades', gradesService.updateSubjectGrades);

module.exports = router;