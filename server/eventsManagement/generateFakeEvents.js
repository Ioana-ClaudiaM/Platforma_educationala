const {faker} = require('@faker-js/faker');
const db = require('../database/dbInit');
const admin = require('firebase-admin');

const generateFakeEventsForAllUsers = async (count = 10) => {
    try{
        const usersSnapshot = await db.collection('users').get();

        if(usersSnapshot.empty){
            console.log('Nu există utilizatori.');
            return;
        }

        for(const userDoc of usersSnapshot.docs){
            const userId = userDoc.id;

            const events = [];
            for(let i = 0; i < count; i++){
                const event = {
                    title: faker.lorem.words(3),
                    date: faker.date.future().toISOString(),
                    type: faker.helpers.arrayElement(['Examen final','Test de seminar','Test parțial','Colocviu','Deadline proiect','Prezentare proiect','Vizită secretariat','Depunere cereri','Întâlnire de grup','Workshop','Career fair','Concurs academic','Voluntariat','Eveniment sportiv']),
                    description: faker.lorem.sentences(2),
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                };

                const docRef = await db.collection('users').doc(userId).collection('events').add(event);
                events.push({ id: docRef.id, ...event });
            }

            console.log(`${count} evenimente fake adăugate pentru utilizatorul ${userId}`);
        }
    }
    catch(error){
        console.error('Eroare la generarea evenimentelor pentru utilizatori:', error);
        throw error;
    }

}

module.exports = { generateFakeEventsForAllUsers };