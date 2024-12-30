const admin = require('firebase-admin');
const serviceAccount = require('../database/digital-journal-26df0-firebase-adminsdk-yuu40-30e959999f.json'); 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  module.exports = db;