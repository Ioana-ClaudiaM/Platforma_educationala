const express = require('express');
const router = express.Router();
const eventsService = require('../eventsManagement/eventsService');

router.post('/events', eventsService.saveEvent);
router.get('/events/:userId', eventsService.loadEvents);
router.put('/events', eventsService.updateEvent);
router.delete('/events', eventsService.deleteEvent);
router.get('/events/:userId', eventsService.fetchEvents);

module.exports = router;