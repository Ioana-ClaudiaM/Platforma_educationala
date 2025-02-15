const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());


const userRouter = require('./userManagement/userRouter');
const timetableRouter = require('./timetableManagement/timetableRouter');
const gradesRouter = require('./gradesManagement/gradesRouter');
const studyResourcesRouter = require('./studyResourcesManagement/studyResourcesRouter');
const eventsRouter = require('./eventsManagement/eventsRouter');
const tasksRouter = require('./tasksManagement/tasksRouter');

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


app.listen(PORT, async (error) => {
  if (!error) {
    console.log(`Server is successfully running and app is listening on port ${PORT}`);
  } else {
    console.log(`Error occurred, server can't start: ${error}`);
  }
});
