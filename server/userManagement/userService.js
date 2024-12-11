const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/dbInit'); 

const JWT_SECRET = process.env.JWT_SECRET || 'DigitalJournal12112024';

const getAllUsers = (req, res) => {
    res.send('you want to get all users');
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, email, password: hashedPassword };
        const addedUser = await db.collection('users').add(newUser);

        res.status(201).json({ id: addedUser.id, email });
    } catch (error) {
        res.status(500).send(JSON.stringify(error));
    }
};

const generateToken = (user) => {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { 
        expiresIn: '24h' 
      }
    );
  };

  const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userSnapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
  
      if (userSnapshot.empty) {
        return res.status(401).json({ message: 'Utilizator negăsit' });
      }
  
      const userDoc = userSnapshot.docs[0];
      const user = { id: userDoc.id, ...userDoc.data() };

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Parolă incorrectă' });
      }
  
      const token = generateToken(user);
  
      const { password: _, ...userResponse } = user;
  
      res.status(200).json({
        message: 'Autentificare reușită',
        token,
        user: userResponse
      });
  
    } catch (error) {
      console.error('Eroare la autentificare:', error);
      res.status(500).json({ message: 'Eroare internă de server', error: error.message });
    }
  };

  const getUserProfile = async (req, res) => {
    try {
      const userDoc = await db.collection('users').doc(req.user.id).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'Utilizator negăsit' });
      }
  
      const userData = userDoc.data();
      const { password, ...profile } = userData;
  
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Eroare la preluarea profilului' });
    }
  };

module.exports = { getAllUsers, registerUser,loginUser,getUserProfile };
