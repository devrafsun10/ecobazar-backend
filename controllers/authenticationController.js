const { mailVerification } = require('../utils/email');
const User = require("../models/userModels")
const jwt = require('jsonwebtoken');

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

    if (!email || !password || !confirmPassword) {
        return res.send({
            message: "All fields are required."
        })
    }

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

    let token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' })

    mailVerification(token,email)

    return res.send({
        message: "User registered successfully."
    })
}

module.exports = { registrationController }