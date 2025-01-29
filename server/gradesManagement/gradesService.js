const db = require('../database/dbInit');
const admin = require('firebase-admin');

const saveSubjectGrades = async (req, res) => {
  const { userId, name, seminarComponents, examWeight, examGrade, finalGrade } = req.body;

  try {
    if (!userId || !name) {
      return res.status(400).send({ error: 'Datele trimise nu sunt conforme sau lipsesc.' });
    }

    await db.collection('users').doc(userId).collection('grades').doc(name)
      .set({
        name,
        seminarComponents,
        examWeight,
        examGrade,
        finalGrade,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.status(200).send({ message: 'Note salvate cu succes!' });
  } catch (error) {
    res.status(500).send({ error: 'A apărut o eroare la salvarea notelor.' + error });
  }
};

const loadGrades = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({ error: 'ID-ul utilizatorului lipsește.' });
  }

  try {
    const gradesSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('grades')
      .get();

    if (gradesSnapshot.empty) {
      return res.status(404).send({ message: 'Nu s-au găsit note pentru utilizator.' });
    }

    const grades = gradesSnapshot.docs.map(doc => doc.data());

    res.status(200).send(grades);
  } catch (error) {
    res.status(500).send({ error: 'A apărut o eroare la încărcarea notelor.' });
  }
};

const deleteSubjectGrade = async (req, res) => {
  const { userId, subjectName } = req.params;

  if (!userId || !subjectName) {
    return res.status(400).send({ error: 'Datele trimise nu sunt conforme sau lipsesc.' });
  }

  try {
    await db.collection('users')
    .doc(userId)
    .collection('grades')
    .doc(subjectName)
    .delete();
    
    res.status(200).send({ message: 'Nota a fost ștearsă cu succes!' });
  } catch (error) {
    res.status(500).send({ error: 'A apărut o eroare la ștergerea notei.' });
  }
};

const updateSubjectGrades = async (req, res) => {
    const { userId, name, seminarComponents, examWeight, examGrade, finalGrade } = req.body;
    try {
      if (!userId || !name) {
        return res.status(400).send({ error: 'Datele trimise nu sunt conforme sau lipsesc.' });
      }
      await db.collection('users').doc(userId).collection('grades').doc(name)
        .update({
          seminarComponents,
          examWeight,
          examGrade,
          finalGrade,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      res.status(200).send({ message: 'Note actualizate cu succes!' });
    } catch (error) {
      res.status(500).send({ error: 'A apărut o eroare la actualizarea notelor.' + error });
    }
  };

module.exports = { saveSubjectGrades, loadGrades, deleteSubjectGrade,updateSubjectGrades };