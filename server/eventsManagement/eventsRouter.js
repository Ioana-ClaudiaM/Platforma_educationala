const express = require('express');
const router = express.Router();
const eventsService = require('../eventsManagement/eventsService');

router.post('/addEvent', eventsService.saveEvent);
router.put('/updateEvent', eventsService.updateEvent);
router.delete('/deleteEvent/:eventId/:userId', eventsService.deleteEvent);
router.get('/events/:userId', eventsService.fetchEvents);

module.exports = router;