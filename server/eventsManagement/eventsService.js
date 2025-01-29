const db = require('../database/dbInit');
const admin = require('firebase-admin');

const saveEvent = async (req, res) => {
    const { userId, event } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const docRef = await db.collection('users').doc(userId).collection('events').add({
            ...event,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        const addedEvent = {
            id: docRef.id,
            ...event
        };

        res.status(200).send({
            message: 'Evenimentul a fost salvat cu succes!',
            event: addedEvent
        });

        console.log(addedEvent);
    } catch (error) {
        res.status(500).send({ error: 'A apărut o eroare la salvarea evenimentului.' });
        console.error('Eroare la salvarea evenimentului:', error);
    }
};

const updateEvent = async (req, res) => {
    const { userId, eventId, eventData } = req.body;
    console.log(userId, eventId, eventData);
    if (!userId || !eventId || !eventData) {
        return res.status(400).send({
            error: 'Lipsesc date necesare (userId, eventId sau eventData)',
            receivedData: { userId, eventId, eventData }
        });
    }

    try {
        const eventRef = db
            .collection('users')
            .doc(userId)
            .collection('events')
            .doc(eventId);

        const eventDoc = await eventRef.get();

        if (!eventDoc.exists) {
            return res.status(404).send({
                error: 'Evenimentul nu a fost găsit'
            });
        }

        await eventRef.update(eventData);

        const updatedEvent = {
            id: eventId,
            ...eventData
        };

        res.status(200).send({
            message: 'Evenimentul a fost actualizat cu succes!',
            event: updatedEvent
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
    const { userId, eventId } = req.params;
    console.log(eventId, userId);

    try {
        const eventRef = await db
            .collection('users')
            .doc(userId)
            .collection('events')
            .doc(eventId);

        const doc = await eventRef.get();
        if (!doc.exists) {
            return res.status(404).send({ error: 'Event-ul nu există.' });
        }

        await eventRef.delete();

        res.status(200).send({
            message: 'Evenimentul a fost șters cu succes!',
            deletedEventId: eventId
        });
    } catch (error) {
        console.error('Eroare la ștergerea evenimentului:', error);
        res.status(500).send({
            error: 'A apărut o eroare la ștergerea evenimentului.'
        });
    }
};

const fetchEvents = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).send({
            error: 'ID-ul utilizatorului lipsește.'
        });
    }

    try {
        const eventsSnapshot = await db.collection('users').doc(userId)
            .collection('events').get();

        if (eventsSnapshot.empty) {
            return res.status(404).send({ message: 'Nu s-au găsit evenimente pentru utilizator.' });
        }

        const events = eventsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).send({ events: events });

    } catch (error) {
        res.status(500).send({
            error: 'A apărut o eroare la încărcarea evenimentelor.'
        });
    }
};

module.exports = {
    saveEvent,
    updateEvent,
    deleteEvent,
    fetchEvents
};