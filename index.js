require('dotenv').config()
const express = require('express');
const cors = require('cors');
const dbConfig = require('./config/dbConfig')
const app = express();
const User = require('./models/userModels');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


//middlewares
app.use(express.json());
app.use(cors());

//database connection
dbConfig();

app.post('/registration', async (req, res) => {
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

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: "ssiyam152@gmail.com",
            pass: "pcagijtuyrpusodc",
        },
    });



    try {
        const info = await transporter.sendMail({
            from: 'ssiyam152@gmail.com', // sender address
            to: email, // list of recipients
            subject: "Please verify your email", // subject line
            html: `<body style=margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f6f8><table align=center cellpadding=0 cellspacing=0 style=max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden width=100%><tr><td style=background-color:#28a745;padding:20px;text-align:center;color:#fff><h1 style=margin:0>Ecobazar</h1><p style="margin:5px 0 0">Fresh & Organic Products<tr><td style=padding:30px;text-align:center><h2 style=color:#333>Verify Your Email</h2><p style=color:#555;line-height:1.6>Thank you for signing up with <strong>Ecobazar</strong>! Please confirm your email address to activate your account.</p><a href="http://localhost:5273/verifyemail/${token}" style="display:inline-block;margin-top:20px;padding:12px 25px;background-color:#28a745;color:#fff;text-decoration:none;border-radius:5px;font-weight:700">Verify Email</a><p style=margin-top:20px;color:#777;font-size:14px>If the button doesn't work, copy and paste this link into your browser:<p style=word-break:break-all;color:#28a745;font-size:14px>{{verification_link}}<tr><td style=background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777><p style=margin:0>© 2026 Ecobazar. All rights reserved.<p style="margin:5px 0">If you didn’t create an account, you can ignore this email.</table>`, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }

    return res.send({
        message: "User registered successfully."
    })
})

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})