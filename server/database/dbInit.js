const admin = require('firebase-admin');
const serviceAccount = require('C:/Users/mierl/OneDrive/Desktop/Digital journal/server/database/digital-journal-26df0-firebase-adminsdk-yuu40-36f52841f7.json'); 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  module.exports = db;