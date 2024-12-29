const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const { generateFakeResourcesForAllUsers } = require('./studyResourcesManagement/generateFakeResources'); 

const app = express();
app.use(express.json());

const userRouter = require('./userManagement/userRouter');
const timetableRouter = require('./timetableManagement/timetableRouter');
const gradesRouter = require('./gradesManagement/gradesRouter');
const studyResourcesRouter = require('./studyResourcesManagement/studyResourcesRouter');
const eventsRouter = require('./eventsManagement/eventsRouter');
const tasksRouter = require('./tasksManagement/tasksRouter');
const PORT = process.env.PORT || 8000;

app.use(morgan(':method :url :status '));
app.use(cors());
app.use(userRouter);
app.use(timetableRouter);
app.use(gradesRouter);
app.use(studyResourcesRouter);
app.use(eventsRouter);
app.use(tasksRouter);

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send("<h1>Hello!</h1>");
});

const initializeServer = async () => {
  try {
    await generateFakeResourcesForAllUsers(10); 
    console.log('Fake resources generated for all users at server startup');
  } catch (error) {
    console.error('Error during server initialization:', error);
  }
};

app.listen(PORT, async (error) => {
  if (!error) {
    console.log(`Server is successfully running and app is listening on port ${PORT}`);
    await initializeServer(); 
  } else {
    console.log(`Error occurred, server can't start: ${error}`);
  }
});
