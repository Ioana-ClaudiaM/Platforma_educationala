const db = require('../database/dbInit');
const admin = require('firebase-admin');

const getUserResources = async (req, res) => {
  const { userId } = req.params;

  try {
    const snapshot = await db
      .collection('resources')
      .where('userId', '==', userId)
      .get();

    const resources = [];
    snapshot.forEach(doc => {
      resources.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(resources);
  } catch (error) {
    console.error('Error retrieving resources:', error);
    return res.status(500).json({ message: 'Error retrieving resources' });
  }
};

const addResource = async (req, res) => {
  const { title, type, category, description, links, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const newResource = {
      title,
      type,
      category,
      description,
      links,
      userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('resources').add(newResource);
    return res.status(200).json({ id: docRef.id, ...newResource });
  } catch (error) {
    console.error('Error adding resource:', error);
    return res.status(500).json({ message: 'Error adding resource' });
  }
};

module.exports = { addResource, getUserResources };
