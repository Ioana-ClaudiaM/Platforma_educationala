const express = require('express');
const router = express.Router();
const studyResourcesService = require('../studyResourcesManagement/studyResourcesService');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { studyResourcesValidationRules } = require('../validators/studyResourcesValidators');

router.post('/addResource', studyResourcesValidationRules(), validate, auth.verifyToken, studyResourcesService.addResource, (req, res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.get('/getUserResources/:userId', validate, auth.verifyToken, studyResourcesService.getUserResources, (req, res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.delete('/deleteResource/:userId/:resourceId', validate, auth.verifyToken, studyResourcesService.deleteResource, (req, res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.put('/updateResource', studyResourcesValidationRules(), validate, auth.verifyToken, studyResourcesService.updateResource, (req, res) => {
    res.status(200).json({ message: 'Token valid' });
});


module.exports = router;
