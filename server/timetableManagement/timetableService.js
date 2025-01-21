const db = require('../database/dbInit');
const admin = require('firebase-admin');

const saveSchedule = async (req, res) => {
  const { userId, schedule, startTime, hourDuration, breakDuration } = req.body;
  
  try {
    if(!userId || !schedule || !startTime || !hourDuration || !breakDuration) {
      return res.status(400).send({ error: 'Datele trimise nu sunt conforme sau lipsesc.' });
    }

    await db.collection('users').doc(userId).collection('timetables').doc('timetable')
      .set({
        schedule,
        startTime,
        hourDuration,
        breakDuration,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      
    res.status(200).send({ message: 'Orar salvat cu succes!' });
  } catch (error) {
    res.status(500).send({ error: 'A apărut o eroare la salvarea orarului.' + error});
  }
};

const loadSchedule = async (req, res) => {
  const userId = req.params.userId;
  if(!userId) {
    return res.status(400).send({ error: 'ID-ul utilizatorului lipsește.' });
  }

  try {
    const doc = await db.collection('users').doc(userId).collection('timetables').doc('timetable').get();
    
    if (!doc.exists) {
      return res.status(404).send({ message: 'Nu s-a găsit un orar pentru utilizator.' });
    }
    
    const data = doc.data();

    res.status(200).send({
      schedule: data.schedule,
      timeConfig: {
        startTime: data.startTime,
        hourDuration: data.hourDuration,
        breakDuration: data.breakDuration
      }
    });
  } catch (error) {
    res.status(500).send({ error: 'A apărut o eroare la încărcarea orarului.' });
  }
};


const deleteSubject = async (req, res) => {
  const { userId, day, index } = req.body;

  if(!userId || !day || !index) { 
    return res.status(400).send({ error: 'Datele trimise nu sunt conforme sau lipsesc.' });
  }
  try {
    const doc = await db.collection('users').doc(userId).collection('timetables').doc('timetable').get();
    
    if (!doc.exists) {
      return res.status(404).send({ message: 'Nu s-a găsit un orar pentru utilizator.' });
    }

    const scheduleData = doc.data();

    if (scheduleData.schedule && scheduleData.schedule[day]) {
      scheduleData.schedule[day][index] = '';
      
      await db.collection('users').doc(userId)
        .collection('timetables').doc('timetable')
        .update({
          schedule: scheduleData.schedule
        });

      res.status(200).send({ message: 'Materia a fost ștearsă cu succes!' });
    } else {
      res.status(400).send({ message: 'Structura orarului este invalidă.' });
    }
  } catch (error) {
    res.status(500).send({ error: 'A apărut o eroare la ștergerea materiei.' });
  }
};

module.exports = { saveSchedule, loadSchedule, deleteSubject };
