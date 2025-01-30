const { generateFakeEventsForAllUsers } = require('../eventsManagement/generateFakeEvents');

generateFakeEventsForAllUsers(10)
    .then(() => {
        console.log("Evenimente generate cu succes!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Eroare la generare:", err);
        process.exit(1);
    });