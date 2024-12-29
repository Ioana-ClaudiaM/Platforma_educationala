const { faker } = require('@faker-js/faker');
const db = require('../database/dbInit');
const admin = require('firebase-admin');

const generateFakeResourcesForAllUsers = async (count = 10) => {
  try {
    const usersSnapshot = await db.collection('users').get();

    if (usersSnapshot.empty) {
      console.log('Nu există utilizatori.');
      return;
    }

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;

      const scheduleDoc = await db.collection('schedules').doc(userId).get();
      if (!scheduleDoc.exists) {
        console.log(`Orar necăutat pentru utilizatorul ${userId}`);
        continue;
      }

      const schedule = scheduleDoc.data().schedule;

      const categories = [];
      Object.keys(schedule).forEach(day => {
        schedule[day].forEach(subject => {
          if (subject && !categories.includes(subject)) {
            categories.push(subject);
          }
        });
      });

      if (categories.length > 0) {
        const resources = [];
        for (let i = 0; i < count; i++) {
          const resource = {
            title: faker.lorem.words(3),
            description: faker.lorem.sentences(2),
            category: faker.helpers.arrayElement(categories), 
            createdAt: faker.date.recent().toISOString(),
            links: [faker.internet.url(), faker.internet.url()],
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            type: faker.helpers.arrayElement(['Video', 'Carte', 'Articol', 'Exerciții', 'Prezentare', 'Podcast']),
          };

          const docRef = await db.collection('users').doc(userId).collection('resources').add(resource);
          resources.push({ id: docRef.id, ...resource });
        }

        console.log(`${count} resurse fake adăugate pentru utilizatorul ${userId}`);
      }
    }
  } catch (error) {
    console.error('Eroare la generarea resurselor pentru utilizatori:', error);
    throw error;
  }
};

module.exports = { generateFakeResourcesForAllUsers };
