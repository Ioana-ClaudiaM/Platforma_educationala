const { body } = require('express-validator');

const tasksValidationRules = () => [
    body('userId')
        .notEmpty()
        .withMessage('Id-ul utilizatorului este necesar'),
    body('title')
        .notEmpty()
        .withMessage('Titlul este necesar'),
    body('description')
        .notEmpty()
        .withMessage('Descrierea este necesară')
        .isLength({ min: 10, max: 500 })
        .withMessage('Descrierea trebuie să conțină între 10 și 500 de caractere'),
    body('dueDate')
        .notEmpty()
        .withMessage('Data limită este necesară')
        .custom((dueDate) => {
            if (new Date(dueDate) < new Date()) {
                throw new Error('Data limită trebuie să fie în viitor');
            }
            return true;
        }),
    body('status')
        .notEmpty()
        .withMessage('Statusul este necesar')
];

module.exports = { tasksValidationRules };