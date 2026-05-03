 const nodemailer = require("nodemailer");
 
 const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: "ssiyam152@gmail.com",
            pass: "pcagijtuyrpusodc",
        },
    });

    let mailVerification = async (token,email) => {
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
    }

    module.exports ={mailVerification}