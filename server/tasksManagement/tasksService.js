const db = require('../database/dbInit');
const admin = require('firebase-admin');

const saveTask = async (req, res) => {
    const { userId, task, eventId } = req.body;
    console.log('Request body:', req.body);
    console.log('userId:', userId, 'eventId:', eventId, 'task:', task);
        if (!userId || !task) {
        return res.status(400).send({ error: 'ID-ul utilizatorului sau datele task-ului lipsesc.' });
    }
    
    try {
        const taskRef = db.collection('users').doc(userId)
                 .collection('events').doc(eventId.toString())
                 .collection('tasks').doc();

        
        const newTask = {
            id: taskRef.id,  
            ...task,
            eventId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };

        await taskRef.set(newTask);
        
        res.status(200).send({
            message: 'Task-ul a fost adăugat cu succes!',
            task: newTask
        });
    } catch (error) {
        res.status(500).send({ error: 'A apărut o eroare la salvarea task-ului.' });
        console.error('Eroare la salvarea task-ului:', error);
    }
};
const loadTasks = async (req, res) => {
    const { userId, eventId } = req.params;

    if (!userId || !eventId) {
        return res.status(400).send({ error: 'userId sau eventId nu sunt valide.' });
    }

    try {
        const tasksRef = db.collection('users').doc(userId)
                          .collection('events').doc(eventId.toString())
                          .collection('tasks');

        const snapshot = await tasksRef.get();

        if (snapshot.empty) {
            return res.status(404).send({ message: 'Nu există task-uri pentru acest eveniment.' });
        }

        const tasks = [];
        snapshot.forEach((doc) => tasks.push({ id: doc.id, ...doc.data() }));

        res.status(200).send({ tasks });
    } catch (error) {
        console.error('Eroare la încărcarea task-urilor:', error);
        res.status(500).send({ error: 'A apărut o eroare la încărcarea task-urilor.' });
    }
};


const updateTask = async (req, res) => {
    const { userId, task, eventId, taskId } = req.body; 
    console.log(userId,task,eventId,taskId)
    try {
        await db
            .collection('users')
            .doc(userId)
            .collection('events')
            .doc(eventId.toString())
            .collection('tasks')
            .doc(taskId.toString())
            .update({
                ...task,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

        res.status(200).send({
            message: 'Task-ul a fost actualizat cu succes!',
            updatedTask: task,
        });
    } catch (error) {
        console.error('Eroare la actualizarea task-ului:', error);
        res.status(500).send({
            error: 'A apărut o eroare la actualizarea task-ului.',
            details: error.message,
        });
    }
};


const deleteTask = async (req, res) => {
    const { userId, taskId } = req.body; 
    console.log(taskId, userId);

    try {
        await db.collection('users').doc(userId).collection('tasks').doc(taskId.toString()).delete();
        
        res.status(200).send({ 
            message: 'Task-ul a fost șters cu succes!',
            deletedTaskId: taskId 
        });
    } catch (error) {
        console.error('Eroare la ștergerea task-ului:', error);
        res.status(500).send({ 
            error: 'A apărut o eroare la ștergerea task-ului.',
            details: error.message 
        });
    }
};

const loadAllTasks = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).send({ error: 'userId nu este valid.' });
    }

    try {
        const eventsRef = db.collection('users').doc(userId)
                          .collection('events');
        const eventsSnapshot = await eventsRef.get();

        if (eventsSnapshot.empty) {
            return res.status(200).send({ tasks: [] });
        }

        const allTasks = [];
        const taskPromises = [];

        eventsSnapshot.forEach((eventDoc) => {
            const eventId = eventDoc.id;
            const tasksPromise = db.collection('users').doc(userId)
                                 .collection('events').doc(eventId)
                                 .collection('tasks')
                                 .get()
                                 .then(tasksSnapshot => {
                                     tasksSnapshot.forEach(taskDoc => {
                                         allTasks.push({
                                             id: taskDoc.id,
                                             eventId: eventId,
                                             ...taskDoc.data()
                                         });
                                     });
                                 });
            taskPromises.push(tasksPromise);
        });

        await Promise.all(taskPromises);

        res.status(200).send({ tasks: allTasks });
    } catch (error) {
        console.error('Eroare la încărcarea tuturor task-urilor:', error);
        res.status(500).send({ 
            error: 'A apărut o eroare la încărcarea task-urilor.',
            details: error.message 
        });
    }
};
module.exports = {
    saveTask,
    loadTasks,
    updateTask,
    deleteTask,
    loadAllTasks
};
