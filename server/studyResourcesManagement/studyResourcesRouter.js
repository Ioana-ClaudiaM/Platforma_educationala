const express = require('express');
const router = express.Router();
const studyResourcesService = require('../studyResourcesManagement/studyResourcesService');

router.post('/addResource', studyResourcesService.addResource);
router.get('/getUserResources/:userId',studyResourcesService.getUserResources);
router.post('/deleteResource',studyResourcesService.deleteResource);
router.post('/updateResource',studyResourcesService.updateResource);

module.exports = router;
