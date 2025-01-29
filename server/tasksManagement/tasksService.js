const db = require('../database/dbInit');
const admin = require('firebase-admin');

const saveTask = async (req, res) => {
    const { userId, task, eventId } = req.body;
    
        if (!userId || !task) {
        return res.status(400).send({ error: 'ID-ul utilizatorului sau datele task-ului lipsesc.' });
    }
    
    try {
        const docRef = await db.collection('users')
        .doc(userId)
        .collection('events')
        .doc(eventId)
        .collection('tasks').add({
            ...task,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        const addedTask = {
            ...task,
            id: docRef.id,
        };

        res.status(200).send({
            message: 'Task-ul a fost adăugat cu succes!',
            task: addedTask,
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
        const tasksSnapshot = await db.collection('users') 
            .doc(userId)
            .collection('events')
            .doc(eventId)
            .collection('tasks')
            .get();

        if (tasksSnapshot.empty) {
            return res.status(404).send({ message: 'Nu există task-uri pentru acest eveniment.' });
        }

        const tasks = tasksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).send({ tasks });
    } catch (error) {
        console.error('Eroare la încărcarea task-urilor:', error);
        res.status(500).send({ error: 'A apărut o eroare la încărcarea task-urilor.' });
    }
};

const updateTask = async (req, res) => {
    const { userId, task, eventId, taskId } = req.body;
    
    if (!userId || !eventId || !taskId || !task) {
        return res.status(400).send({ 
            error: 'Datele necesare lipsesc. Este nevoie de userId, eventId, taskId și datele task-ului.' 
        });
    }

    try {
        const taskRef = db
            .collection('users')
            .doc(userId)
            .collection('events')
            .doc(eventId)
            .collection('tasks')
            .doc(taskId);

        const docSnapshot = await taskRef.get();
        if (!docSnapshot.exists) {
            return res.status(404).send({ error: 'Task-ul nu există.' });
        }

        await taskRef.update({
            ...task,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const updatedTask = {
            ...task,
            id: taskId,
            eventId
        };

        res.status(200).send({
            message: 'Task-ul a fost actualizat cu succes!',
            task: updatedTask,
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
    const { userId, eventId, taskId } = req.params; 
    
    try {
        const taskRef = db.collection('users')
            .doc(userId)
            .collection('events')
            .doc(eventId)
            .collection('tasks')
            .doc(taskId);
            
        const doc = await taskRef.get();
        if (!doc.exists) {
            return res.status(404).send({ error: 'Task-ul nu există.' });
        }
        
        await taskRef.delete();
        
        res.status(200).send({ 
            message: 'Task-ul a fost șters cu succes!',
            deletedTaskId: taskId 
        });
    } catch (error) {
        console.error('Eroare la ștergerea task-ului:', error);
        res.status(500).send({ error: 'A apărut o eroare la ștergerea task-ului.' });
    }
};

const loadAllTasks = async (req, res) => {
    const { userId, eventId } = req.params;

    if (!userId || !eventId) {
        return res.status(400).send({ error: 'userId sau eventId lipsesc.' });
    }

    try {
        const tasksRef = db.collection('users')
            .doc(userId)
            .collection('events')
            .doc(eventId)
            .collection('tasks');

        const tasksSnapshot = await tasksRef.get();

        if (tasksSnapshot.empty) {
            return res.status(200).send({ 
                tasks: [],
                message: 'Nu există taskuri pentru acest eveniment.' 
            });
        }

        const tasks = tasksSnapshot.docs.map(doc => ({
            id: doc.id,
            eventId,
            ...doc.data()
        }));

        return res.status(200).send({ tasks });

    } catch (error) {
        console.error('Eroare la încărcarea task-urilor:', error);
        return res.status(500).send({ 
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
