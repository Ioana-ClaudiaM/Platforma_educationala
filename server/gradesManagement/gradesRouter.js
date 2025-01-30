const express = require('express');
const router = express.Router();
const gradesService = require('../gradesManagement/gradesService');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {gradesValidationRules} = require('../validators/gradesValidators');

router.post('/saveSubjectGrades', gradesValidationRules(),auth.verifyToken, validate, gradesService.saveSubjectGrades, (req,res) => {
    res.status(200).send({message: 'Token valid!'});
});
router.get('/loadGrades/:userId', auth.verifyToken, validate, gradesService.loadGrades, (req,res) => {
    res.status(200).send({message: 'Token valid!'});
});
router.delete('/deleteSubjectGrade/:userId/:subjectName', auth.verifyToken, validate, gradesService.deleteSubjectGrade, (req,res) => {
    res.status(200).send({message: 'Token valid!'});
});
router.put('/updateSubjectGrades', gradesValidationRules(), auth.verifyToken, validate, gradesService.updateSubjectGrades, (req,res) => {
    res.status(200).send({message: 'Token valid!'});
});

module.exports = router;