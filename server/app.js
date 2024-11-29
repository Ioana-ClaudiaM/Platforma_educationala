const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('C:/Users/mierl/OneDrive/Desktop/Digital journal/server/database/digital-journal-project-firebase-adminsdk-ijk5i-14ccf04b02.json'); 

const app = express();
const PORT = process.env.PORT || 8080;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

const db = admin.firestore();
  
app.use(morgan(':method :url :status '));
app.use(cors());

app.get('/' , (req,res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).send("<h1>Hello!</h1>");
})

app.listen(PORT, (error) => {
    if(!error)
        console.log("Server is successfully running and app is listening on port "+PORT);
    else{
        console.log("Error occured, server can't start "+error);
    }
})