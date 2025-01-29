const db = require('../database/dbInit');
const admin = require('firebase-admin');

const getUserResources = async (req, res) => {
  const { userId } = req.params;
  try {
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('resources')
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
  const { userId, resource } = req.body;
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const docRef = await db
      .collection('users')
      .doc(userId)
      .collection('resources')
      .add({
        ...resource,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

    const addedResource = {
      id: docRef.id,
      ...resource,
    };

    return res.status(200).json({
      message: 'Resource added successfully!',
      resource: addedResource
    });
  } catch (error) {
    console.error('Error adding resource:', error);
    return res.status(500).json({ message: 'Error adding resource' });
  }
};

const deleteResource = async (req, res) => {
  const {resourceId,userId} = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (!resourceId) {
    return res.status(400).json({ message: 'Resource ID is required' });
  }

  try {
    await db
      .collection('users')
      .doc(userId)
      .collection('resources')
      .doc(resourceId)
      .delete();

    return res.status(200).json({ message: 'Resource deleted successfully!' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return res.status(500).json({ message: 'Error deleting resource' });
  }
}

const updateResource = async (req, res) => {
const { userId, resourceId, resourceData } = req.body;
console.log(resourceId,resourceData)

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (!resourceId) {
    return res.status(400).json({ message: 'Resource ID is required' });
  }

  try {
    await db
      .collection('users')
      .doc(userId)
      .collection('resources')
      .doc(resourceId)
      .update(resourceData);
    return res.status(200).json({ message: 'Resource updated successfully!' });
  } catch (error) {
    console.error('Error updating resource:', error);
    return res.status(500).json({ message: 'Error updating resource' });
  }
}

module.exports = { addResource, getUserResources, deleteResource, updateResource };