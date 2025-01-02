const db = require('../database/dbInit'); 
const admin = require('firebase-admin');

const saveGrades = async (req, res) => {
    const { userId, subject } = req.body; 
    try {
        await db.collection('subject_grades').doc(userId).collection('subjects').doc(subject.name).set({
            ...subject,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(200).send({ message: 'Notele au fost salvate cu succes!' });
    } catch (error) {
        res.status(500).send({ error: 'A apărut o eroare la salvarea notelor.' });
        console.error('Eroare la salvarea notelor:', error);
    }
};

const loadGrades = async (req, res) => {
    const userId = req.params.userId;
    try {
        const subjectsSnapshot = await db.collection('subject_grades').doc(userId).collection('subjects').get();
        
        const subjects = [];
        subjectsSnapshot.forEach(doc => {
            subjects.push(doc.data());
        });

        res.status(200).send({ subjects });
    } catch (error) {
        console.error('Error loading grades:', error);
        res.status(500).send({ error: 'A apărut o eroare la încărcarea notelor.' });
    }
};


const updateGrade = async (req, res) => {
    const { userId, subject } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Tokennn:"+token)
    try {
        await db.collection('subject_grades').doc(userId).collection('subjects').doc(subject.name).update({
            ...subject,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        res.status(200).send({ 
            message: 'Notele au fost actualizate cu succes!',
            updatedSubject: subject 
        });
    } catch (error) {
        console.error('Eroare la actualizarea notelor:', error);
        res.status(500).send({ 
            error: 'A apărut o eroare la actualizarea notelor.',
            details: error.message 
        });
    }
};

const deleteGrade = async (req, res) => {
    const { userId, subjectName } = req.body;
    try {
        await db.collection('subject_grades').doc(userId).collection('subjects').doc(subjectName).delete();
        
        res.status(200).send({ 
            message: 'Nota pentru materie a fost ștearsă cu succes!',
            deletedSubject: subjectName 
        });
    } catch (error) {
        console.error('Eroare la ștergerea notei:', error);
        res.status(500).send({ 
            error: 'A apărut o eroare la ștergerea notei.',
            details: error.message 
        });
    }
};

module.exports = {
    saveGrades, 
    loadGrades,
    updateGrade,
    deleteGrade
};
