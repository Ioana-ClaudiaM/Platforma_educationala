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
                    if( component.grade > 10 || component.grade<1){
                        throw new Error('Nota trebuie să fie între 1 și 10');
                    }
                    if(component.weight > 100 || component.weight < 0){
                        throw new Error('Ponderea trebuie sa fie intre 0 si 100');
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
    .isFloat({min: 1, max: 10})
    .withMessage('Nota examenului trebuie să fie un număr între 1 și 10')
];

module.exports = { gradesValidationRules };
