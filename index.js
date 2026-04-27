require('dotenv').config()
const express = require('express');
const cors = require('cors');
const dbConfig = require('./config/dbConfig')
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//database connection
dbConfig();

app.get('/', (req, res)=> {
    res.send("HOWDY!")
})

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);   
})