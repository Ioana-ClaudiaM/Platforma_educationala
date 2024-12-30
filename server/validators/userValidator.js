const { body } = require('express-validator');
const db = require('../database/dbInit');

const checkEmailNotInUse = async (email) => {
  const userSnapshot = await db.collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();
  
  if (!userSnapshot.empty) {
    throw new Error('Acest email este deja înregistrat');
  }
  return true;
};

const userValidationRules = () => {
  return [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username trebuie să aibă minim 3 caractere'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email invalid')
      .custom(checkEmailNotInUse),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Parola trebuie să aibă minim 8 caractere')
      .matches(/\d/)
      .withMessage('Parola trebuie să conțină cel puțin un număr')
      .matches(/[A-Z]/)
      .withMessage('Parola trebuie să conțină cel puțin o literă mare')
  ];
};

const loginValidationRules = () => {
  return [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email invalid'),
    body('password')
      .exists()
      .withMessage('Parola este necesară')
  ];
};

module.exports = {
  userValidationRules,
  loginValidationRules
};