const { mailVerification, resetPasswordMailVerification } = require('../utils/email');
const User = require("../models/userModels")
const { emptyFeildValidation } = require('../utils/validation');
const { tokenGenerator } = require('../utils/tokenGenerator');
const { existingData } = require('../utils/exsistingData');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

let registrationController = async (req, res) => {
    const { email, password, confirmPassword, fullName,  role } = req.body;

   let users= (await existingData(res,{email:email}))
   if(users){
    return res.send({
        success: false,
        message: "User exist"
    })
   }

    // if (!terms) {
    //     return res.send({
    //         success: false,
    //         message: "Please accept the terms and conditions."
    //     })
    // }

     emptyFeildValidation(res,email,password,confirmPassword)

 

    if (password !== confirmPassword) {
        return res.send({
            success: false,
            message: "Password and confirm password do not match."
        })
    }

    const hash = bcrypt.hashSync(password, 10);


    let user = new User({
        email: email,
        password: hash,
        fullName: fullName,
        role: role
    })

    await user.save();

   let token = tokenGenerator({
            id: user._id,
            email: user.email
        }, process.env.ACCESS_TOKEN_SECRET,"1d")

    mailVerification(token,email)

    return res.send({
        success:true,
        message: "User registered successfully,please check your email for verification."
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
            success: false,
            message: "Invalid Credential"
        })
     }

     res.send({
        success: true,
        message:"Login Successful",
    user: {
        id: users._id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        profile: users.profile,
        phoneNumber: users.phoneNumber,
        isVerified: users.isVerified
    }
     })
}

let forgotPasswordController = async (req,res) => {
    let {email} = req.body
    emptyFeildValidation(res,email)

    let users = await existingData(res,{email:email})
    if(!users){
        return res.send({
            success: false,
            message:"User not found"
        })
    }

    let token = tokenGenerator({
            id: users._id,
            email: users.email
        }, process.env.ACCESS_TOKEN_SECRET,"1d")

    resetPasswordMailVerification(token,email)

    res.send({
        success: true,
        message:"please check your email."
    })
}

let resetPasswordController = async (req,res) => {
    let {newPassword,confirmPassword} = req.body
    let {token} = req.params

    if(newPassword !== confirmPassword){
        res.send({
            success: false,
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
                    success:true,
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

    res.send({
        success: true,
        message:"check your email for verification"
    })
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
                res.send({
                    success:true,
                    message:"Email verified successfully."
                })
            }
        }
    })
}

module.exports = { registrationController, loginController, forgotPasswordController,resetPasswordController,resendVerificationController,verifyEmailController}