const express = require('express');
const router = express.Router();
const eventsService = require('../eventsManagement/eventsService');
const {eventsValidationRules} = require('../validators/eventsValidators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/addEvent', eventsValidationRules(), validate, auth.verifyToken, eventsService.saveEvent , (req,res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.put('/updateEvent', eventsValidationRules(), validate, auth.verifyToken ,eventsService.updateEvent , (req,res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.delete('/deleteEvent/:eventId/:userId', auth.verifyToken, eventsService.deleteEvent , (req,res) => {
    res.status(200).json({ message: 'Token valid' });
});
router.get('/events/:userId', auth.verifyToken,eventsService.fetchEvents, (req,res) => {
    res.status(200).json({ message: 'Token valid' });
});

module.exports = router;