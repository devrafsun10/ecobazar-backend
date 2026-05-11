require("node:dns/promises").setServers (["1.1.1.1", "8.8.8.8"]);

require('dotenv').config()
const express = require('express');
const cors = require('cors');
const dbConfig = require('./config/dbConfig');
const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationController, verifyEmailController } = require("./controllers/authenticationController");
const User = require('./models/userModels');
const app = express();
const { rateLimit } = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 2, 
	standardHeaders: 'draft-8',
	legacyHeaders: false, 
	ipv6Subnet: 56, 
})

app.use(limiter)
//middlewares
app.use(express.json());
app.use(cors());

//database connection
dbConfig();

app.post('/registration',limiter, registrationController)
app.post('/login', loginController)
app.post('/forgotpassword', forgotPasswordController)
app.post('/resetPassword/:token', resetPasswordController)
app.post('/resendverificationemail', resendVerificationController )
app.post('/verifyemail/:token', verifyEmailController)

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})