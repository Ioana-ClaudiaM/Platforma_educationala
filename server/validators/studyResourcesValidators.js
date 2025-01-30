const { body } = require('express-validator');

const studyResourcesValidationRules = () => [
    body('title')
        .isString()
        .isLength({ min: 3, max: 50 })
        .withMessage('Titlul trebuie să conțină între 3 și 50 de caractere'),
    body('description')
        .isString()
        .isLength({ min: 10, max: 500 })
        .withMessage('Descrierea trebuie să conțină între 10 și 500 de caractere'),
    body('type')
        .notEmpty()
        .withMessage('Tipul este necesar'),
    body('category')
        .notEmpty()
        .withMessage('Categoria este necesară'),
    body('links')
        .custom((links) => {
            if (links.length > 0) {
                for (let link of links) {
                    console.log(link.url)
                    if (!link.url.startsWith('http')) {
                        throw new Error('Link-ul trebuie să conțină http sau https');
                    }
                }
                return true;
            } else {
                throw new Error('Trebuie să adăugați cel puțin un link');
            }
        }),
    body('userId')
        .notEmpty()
        .withMessage('Id-ul utilizatorului este necesar')
];

module.exports = { studyResourcesValidationRules };