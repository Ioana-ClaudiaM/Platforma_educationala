const express = require('express');
const router = express.Router();
const gradesService = require('../gradesManagement/gradesService');

router.post('/saveSubjectGrades', gradesService.saveGrades);
router.get('/loadSubjectGrades/:userId', gradesService.loadGrades);
router.put('/updateSubjectGrades', gradesService.updateGrade);
router.delete('/deleteSubjectGrade', gradesService.deleteGrade);

module.exports = router;


