const { mailVerification, resetPasswordMailVerification } = require('../utils/email');
const User = require("../models/userModels")
const { emptyFeildValidation } = require('../utils/validation');
const { tokenGenerator } = require('../utils/tokenGenerator');
const { existingData } = require('../utils/exsistingData');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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

let forgotPasswordController = async (req,res) => {
    let {email} = req.body
    emptyFeildValidation(res,email)

    let users = await existingData(res,{email:email})
    if(!users){
        return res.send({
            message:"User not found"
        })
    }

    let token = tokenGenerator({
            id: users._id,
            email: users.email
        }, process.env.ACCESS_TOKEN_SECRET,"1d")

    resetPasswordMailVerification(token,email)

    res.send({message:"please check your email."})
}

let resetPasswordController = async (req,res) => {
    let {newPassword,confirmPassword} = req.body
    let {token} = req.params

    if(newPassword !== confirmPassword){
        res.send({
            message: "Confirm password not matched"
        })
    }

     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded) {
             if(err){
                 res.send({
                     message: "Unauthorized"
                 })
             } else {
                 const hash = bcrypt.hashSync(newPassword, 10);
                 const updateData = await User.findByIdAndUpdate({_id: decoded.id},{password: hash},{new : true})
                 res.send({
                    message:"Password updated"
                 })
             }
     });
}

let resendVerificationController = async (req,res) => {
    let {email} = req.body

    let user = await User.findOne({email:email})

    let token = tokenGenerator({
            id: user._id,
            email: user.email
        }, process.env.ACCESS_TOKEN_SECRET,"1d")

    mailVerification(token,email)   

    res.send({message:"check your email for verification"})
}

let verifyEmailController = async (req,res) => {
    const {token} = req.params

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, async (err,decoded)=>{
        if(err){
            res.send({message:"Unauthorized"})
        }else{
            const userId = decoded.id
            let findUser = await User.findById(userId)
            if(findUser.isVerified){
                return res.send({message:"User already verified"})
            }else{
                findUser.isVerified = true
                findUser.save()
                res.send({message:"Email verified successfully."})
            }
        }
    })
}

module.exports = { registrationController, loginController, forgotPasswordController,resetPasswordController,resendVerificationController,verifyEmailController}