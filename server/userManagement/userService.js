const bcrypt = require('bcrypt');
const db = require('../database/dbInit'); 

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


module.exports = { getAllUsers, registerUser };
