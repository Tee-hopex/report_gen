// const mongoose= require("mongoose");
// require("dotenv").config()

// mongoose.connect(process.env.MONGO_URI)
//     .catch(error => console.log('DB Connection error: ' +error));
// const con = mongoose.connection;
// // handle error when opening db
// con.on('open', error => {
//     if (!error)
//         console.log('DB Connection Successful');
//     else
//         console.log('Error Connecting to DB: ${error}');
// });

// // handle mongoose disconnect from mongodb
// con.on('disconnected', error => {
//     console.log(`Mongoose lost connection with MongoDB:
//     ${error}`);
// });

const express = require("express");
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT;

// const { fileURLToPath } = require('url');
// const __filename = fileURLToPath(new URL(import.meta.url, 'file:'));
// const __dirname = dirname(__filename);

// Serve static files from the current directory
app.use(express.static(__dirname));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.get("/environment", (req, res) => {
    res.sendFile(path.join(__dirname, "DOHS frontend/my-dohs-report-gen/src/index.html"));
  });

app.get("/disease", (req, res) => {
  res.sendFile(path.join(__dirname, "DOHS frontend/disease-cases-zipped/disease-cases/src/index.html"));
});


app.use('/environment', require('./routes/environmental_report.js'))

app.use('/disease', require('./routes/disease_control.js'))


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
