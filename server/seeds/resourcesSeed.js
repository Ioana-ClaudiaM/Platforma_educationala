const { generateFakeResourcesForAllUsers } = require('../studyResourcesManagement/generateFakeResources'); 

generateFakeResourcesForAllUsers(10) 
  .then(() => {
    console.log("Resurse generate cu succes!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Eroare la generare:", err);
    process.exit(1);
  });