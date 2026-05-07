require("node:dns/promises").setServers (["1.1.1.1", "8.8.8.8"]);

require('dotenv').config()
const express = require('express');
const cors = require('cors');
const dbConfig = require('./config/dbConfig');
const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationController } = require("./controllers/authenticationController");
const User = require('./models/userModels');
const app = express();


//middlewares
app.use(express.json());
app.use(cors());

//database connection
dbConfig();

app.post('/registration', registrationController)
app.post('/login', loginController)
app.post('/forgotpassword', forgotPasswordController)
app.post('/resetPassword/:token', resetPasswordController)
app.post('/resendverificationemail', resendVerificationController )

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})