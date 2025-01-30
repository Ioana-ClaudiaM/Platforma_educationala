const db = require('../database/dbInit');
const admin = require('firebase-admin');

const saveEvent = async (req, res) => {
    const { userId, title, date, type, description } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const docRef = await db.collection('users').doc(userId).collection('events').add({
            title,
            date,
            type,
            description,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        const addedEvent = {
            id: docRef.id,
            title,
            date,
            type,
            description,
        };

        res.status(200).send({
            message: 'Evenimentul a fost salvat cu succes!',
            event: addedEvent
        });

    } catch (error) {
        res.status(500).send({ error: 'A apărut o eroare la salvarea evenimentului.' });
    }
};

const updateEvent = async (req, res) => {
    const { userId, eventId, title, date, type, description } = req.body;
    
    if(!userId){ 
        return res.status(400).send({ error: 'ID-ul utilizatorului lipsește.' });
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

        await eventRef.update({
            title,
            date,
            type,
            description,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        const updatedEvent = {
            id: eventId,
            title, 
            date, 
            type, 
            description
        };

        res.status(200).send({
            message: 'Evenimentul a fost actualizat cu succes!',
            event: updatedEvent
        });
    } catch (error) {
        res.status(500).send({
            error: 'A apărut o eroare la actualizarea evenimentului.',
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