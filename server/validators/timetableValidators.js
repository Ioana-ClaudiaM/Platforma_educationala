const { body } = require('express-validator');

const timetableValidationRules = () => {
    return [
        body('userId')
            .trim()
            .notEmpty()
            .withMessage('ID utilizator invalid'),
        
        body('schedule')
            .notEmpty()
            .custom((schedule) => {
                for (let day in schedule) {
                    for (let subject of schedule[day]) {
                        if (!/^[a-zA-ZăîâșțĂÎÂȘȚ0-9\s]*$/.test(subject)) {
                            throw new Error(`Materie invalidă găsită în ziua ${day}: ${subject}`);
                        }
                    }
                }
                return true;
            })
,
        body('startTime')
            .trim()
            .notEmpty()
            .isInt({ min: 0, max: 23 })
            .withMessage('Ora de început trebuie să fie între 0 și 23'),

        body('hourDuration')
            .trim()
            .notEmpty()
            .withMessage('Durata unei ore invalidă'),

        body('breakDuration')
            .trim()
            .notEmpty()
            .withMessage('Durata pauzei invalidă')
    ];
};

module.exports = { timetableValidationRules };
