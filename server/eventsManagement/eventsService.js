const db = require('../database/dbInit');
const admin = require('firebase-admin');

const saveEvent = async (req, res) => {
    const { userId, event } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
    try {
        await db.collection('users').doc(userId).collection('events').doc(event.id.toString()).set({
            ...event,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        res.status(200).send({
            message: 'Evenimentul a fost salvat cu succes!',
            eventId: event.id
        });
    } catch (error) {
        res.status(500).send({ error: 'A apărut o eroare la salvarea evenimentului.' });
        console.error('Eroare la salvarea evenimentului:', error);
    }
};

const loadEvents = async (req, res) => {
    const { userId } = req.params;

    try {
        let query = db.collection('users').doc(userId).collection('events');

        const eventsSnapshot = await query.get();

        if (eventsSnapshot.empty) {
            return res.status(404).send({ message: 'Nu au fost găsite evenimente pentru acest utilizator.' });
        }

        const events = [];
        eventsSnapshot.forEach(doc => {
            events.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).send({ events });
    } catch (error) {
        console.error('Eroare la încărcarea evenimentelor:', error);
        res.status(500).send({ error: 'A apărut o eroare la încărcarea evenimentelor.' });
    }
};

const updateEvent = async (req, res) => {
    const { userId, event } = req.body;

    try {
        await db.collection('users').doc(userId).collection('events').doc(event.id.toString()).update({
            ...event,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        res.status(200).send({ 
            message: 'Evenimentul a fost actualizat cu succes!',
            updatedEvent: event 
        });
    } catch (error) {
        console.error('Eroare la actualizarea evenimentului:', error);
        res.status(500).send({ 
            error: 'A apărut o eroare la actualizarea evenimentului.',
            details: error.message 
        });
    }
};

const deleteEvent = async (req, res) => {
    const { userId, eventId } = req.body; 
    console.log(eventId, userId);

    try {
        await db.collection('users').doc(userId).collection('events').doc(eventId.toString()).delete();
        
        res.status(200).send({ 
            message: 'Evenimentul a fost șters cu succes!',
            deletedEventId: eventId 
        });
    } catch (error) {
        console.error('Eroare la ștergerea evenimentului:', error);
        res.status(500).send({ 
            error: 'A apărut o eroare la ștergerea evenimentului.',
            details: error.message 
        });
    }
};

const fetchEvents = async (req, res) => {
    const { userId } = req.params;
    
    console.log('Fetching events for userId:', userId);
    
    if (!userId) {
        return res.status(400).send({ 
            error: 'ID-ul utilizatorului lipsește.' 
        });
    }

    try {
        const eventsRef = db.collection('users').doc(userId)
                          .collection('events');
        
        const snapshot = await eventsRef.get();

        if (snapshot.empty) {
            return res.status(200).send({ 
                events: [],
                message: 'Nu există evenimente pentru acest utilizator.' 
            });
        }

        const events = [];
        snapshot.forEach((doc) => {
            events.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).send({
            events: events
        });
        
    } catch (error) {
        console.error('Eroare la preluarea evenimentelor:', error);
        res.status(500).send({ 
            error: 'A apărut o eroare la încărcarea evenimentelor.',
            details: error.message 
        });
    }
};

module.exports = {
    saveEvent,
    loadEvents,
    updateEvent,
    deleteEvent,
    fetchEvents
};