const { mailVerification } = require('../utils/email');
const User = require("../models/userModels")
const { emptyFeildValidation } = require('../utils/validation');
const { tokenGenerator } = require('../utils/tokenGenerator');
const { existingData } = require('../utils/exsistingData');
const bcrypt = require('bcrypt');

let registrationController = async (req, res) => {
    const { email, password, confirmPassword, terms } = req.body;

   let users= (await existingData(res,{email:email}))
   if(users){
    return res.send({message: "User exist"})
   }

    if (!terms) {
        return res.send({
            message: "Please accept the terms and conditions."
        })
    }

     emptyFeildValidation(res,email,password,confirmPassword)

 

    if (password !== confirmPassword) {
        return res.send({
            message: "Password and confirm password do not match."
        })
    }

    const hash = bcrypt.hashSync(password, 10);


    let user = new User({
        email: email,
        password: hash,
        terms: terms,
    })

    await user.save();

   let token = tokenGenerator({
            id: user._id,
            email: user.email
        }, process.env.ACCESS_TOKEN_SECRET,"1d")

    mailVerification(token,email)

    return res.send({
        message: "User registered successfully."
    })
}

let loginController = async (req,res) => {
    const { email, password} = req.body;

   let users = await existingData(res,{email:email})
   
   
   
   if(!users){
    return res.send({
        message: "User not found"
    })
   }

     emptyFeildValidation(res,email,password)

     let pass = bcrypt.compareSync(password, users.password);
     

     if(!pass) {
        return res.send({
            message: "Invalid Credential"
        })
     }

     res.send({
        message:"Login Successful"
     })
}

module.exports = { registrationController, loginController }