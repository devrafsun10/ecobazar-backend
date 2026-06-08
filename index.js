require("node:dns/promises").setServers (["1.1.1.1", "8.8.8.8"]);

require('dotenv').config()
const express = require('express');
const cors = require('cors');
const dbConfig = require('./config/dbConfig');
const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationController, verifyEmailController } = require("./controllers/authenticationController");
const User = require('./models/userModels');
const app = express();
const { rateLimit } = require('express-rate-limit');
const { getAllUsersController, singleUserDataController, deleteUserController, updateUserController } = require("./controllers/userControllers");
const { createProductController, getProductController, getSingleProductController, productDeleteController, productUpdateController } = require("./controllers/productController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/products');//set the destination for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);//set the filename for uploded files
  },
});

const upload = multer({ storage: storage });

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

//product create
app.post('/createproduct',  upload.array('photos', 5) , createProductController)
app.get('/allproduct', getProductController)
app.get('/singleproduct/:id', getSingleProductController)
app.get('/deleteproduct/:id', productDeleteController)
app.put('/updateproduct/:id', productUpdateController)

//order management

//user mangement
app.get('/allusers', getAllUsersController)
app.get('/singleuser/:id',singleUserDataController)
app.delete('/deleteuser/:id',deleteUserController)
app.post('/updateuser/:id',upload.array('photos', 5),updateUserController)

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})