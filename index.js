require('dotenv').config()
const express = require('express');
const cors = require('cors');
const dbConfig = require('./config/dbConfig')
const app = express();
const User = require('./models/userModels');
const jwt = require('jsonwebtoken');


//middlewares
app.use(express.json());
app.use(cors());

//database connection
dbConfig();

app.post('/registration', async (req, res)=> {
    const {email, password, confirmPassword,terms} = req.body;
    
    let existingUser = await User.findOne({email: email});

    if(existingUser){
        return res.send({
            message: "User already exists."
        })
    }

    if(!terms){
        return res.send({
            message: "Please accept the terms and conditions."
        })
    }

    if(!email || !password || !confirmPassword){
        return res.send({
            message: "All fields are required."
        })
    }

    if(password !== confirmPassword){
        return res.send({
            message: "Password and confirm password do not match."
        })
    }

    

    let user = new User({
        email: email,
        password: password,
        terms: terms,
    })

    let token = jwt.sign(
        {
            id: user._id,
            email: user.email
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: '1d'})

    await user.save();

    return res.send({
        message: "User registered successfully."
    })
})

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);   
})