const { mailVerification } = require('../utils/email');
const User = require("../models/userModels")
const { emptyFeildValidation } = require('../utils/validation');
const { tokenGenerator } = require('../utils/tokenGenerator');

let registrationController = async (req, res) => {
    const { email, password, confirmPassword, terms } = req.body;
   

    let existingUser = await User.findOne({ email: email });

    if (existingUser) {
        return res.send({
            message: "User already exists."
        })
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



    let user = new User({
        email: email,
        password: password,
        terms: terms,
    })

    await user.save();

    tokenGenerator({
            id: user._id,
            email: user.email
        }, process.env.ACCESS_TOKEN_SECRET,"1d")

    mailVerification(token,email)

    return res.send({
        message: "User registered successfully."
    })
}

module.exports = { registrationController }