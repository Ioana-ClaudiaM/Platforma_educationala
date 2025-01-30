const { body } = require('express-validator');

const eventsValidationRules = () => {
    return [
        body('userId')
            .notEmpty()
            .withMessage('User ID is required'),
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ min: 5, max: 50 })
            .withMessage('Titlul trebuie să aibă între 5 și 50 de caractere'),
        body('date')
            .notEmpty()
            .withMessage('Date is required')
            .custom((value) => {
                const today = new Date().toISOString().split('T')[0]; 
                if (value < today) {
                  throw new Error('Data nu poate fi în trecut.');
                }
                return true;
              }),
        body('type')
            .notEmpty()
            .withMessage('Type is required'),
        body('description')
            .notEmpty()
            .withMessage('Description is required')
            .isLength({ min: 10, max: 200 })
    ];
}

module.exports = {eventsValidationRules};