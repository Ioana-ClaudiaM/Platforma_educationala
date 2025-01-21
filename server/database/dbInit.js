const admin = require('firebase-admin');
const serviceAccount = require('../database/educational-platform-8e0c2-firebase-adminsdk-fbsvc-ecc0693f96.json'); 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  module.exports = db;