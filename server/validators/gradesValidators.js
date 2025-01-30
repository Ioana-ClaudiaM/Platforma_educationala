const { body } = require('express-validator');

const gradesValidationRules = () => [
    body('name')
        .notEmpty()
        .withMessage('Numele materiei este necesar'),

    body('seminarComponents')
        .custom((seminarComponents) => {
            if (seminarComponents.length > 0) {
                for (let component of seminarComponents) {
                    if (component.name === '') {
                        throw new Error('Numele componentei este necesar');
                    }
                    if (component.weight === 0) {
                        throw new Error('Ponderea componentei este necesară');
                    }
                    if (component.grade === 0) {
                        throw new Error('Nota componentei este necesară');
                    }
                }
                return true;
            } else {
                throw new Error('Trebuie să adăugați cel puțin o notă');
            }
        })
        .custom((seminarComponents) => {
            const totalSeminarWeight = seminarComponents.reduce((acc, component) => acc + (component.weight || 0), 0);
            if (totalSeminarWeight === 100) {
                throw new Error('Ponderea totală a componentelor seminarului nu trebuie să fie 100%, deoarece trebuie să se țină cont și de examen');
            }
            return true;
        }),

    body('examWeight')
        .notEmpty()
        .withMessage('Ponderea examenului este necesară')
        .custom((examWeight, { req }) => {
            const seminarComponents = req.body.seminarComponents || [];
            const totalSeminarWeight = seminarComponents.reduce((acc, component) => acc + (component.weight || 0), 0);
            const maxExamWeight = 100 - totalSeminarWeight;
            const totalWeight = totalSeminarWeight + examWeight;

            if (totalSeminarWeight!== 100 && (examWeight < 0 || examWeight !== maxExamWeight )) {
                throw new Error(`Ponderea examenului trebuie să fie ${maxExamWeight}%, nu se poate ca procentul mediei finale să valoreze ${totalWeight}%!`);
            }
            return true;
        }),
    body('examGrade')
    .notEmpty()
    .withMessage('Nota examenului este necesară')
    .isFloat({min: 0, max: 10})
    .withMessage('Nota examenului trebuie să fie un număr între 0 și 10')
];

module.exports = { gradesValidationRules };
