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
      .notEmpty()
      .isLength({ min: 3 })
      .matches(/^[a-zA-Z0-9_]*$/)
      .withMessage('Username trebuie să aibă minim 3 caractere, să nu conțină spații și să conțină doar litere, cifre și _'),
    body('email')
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage('Email invalid')
      .custom(checkEmailNotInUse),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Parola trebuie să aibă minim 8 caractere')
      .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Parola trebuie să conțină cel puțin o literă mare, o literă mică, o cifră și un caracter special')
  ];
};

const loginValidationRules = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage('Email invalid sau incomplet'),
    body('password')
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage('Parola este necesară și trebuie să aibă minim 8 caractere')
  ];
};

module.exports = {
  userValidationRules,
  loginValidationRules
};