const jwt = require('jsonwebtoken');
const mailer = require("nodemailer");

const User = require('../models/User.js');

const mysql = require('mysql2');
const env = require('dotenv');

env.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST || '',
    user: process.env.MYSQL_ADDON_USER || '',
    password: process.env.MYSQL_ADDON_PASSWORD || '',
    database: process.env.MYSQL_ADDON_DB || '',
    port: process.env.MYSQL_ADDON_PORT || '8080'
}).promise();

// controller actions
signup_get = (req, res) => {
    res.render('signup');
}
login_get = (req, res) => {
    res.render('login');
}

forgetpassword_get = (req, res) => {
    res.render('forgetpassword');
}

resetpassword_get = (req, res) => {
    res.render('resetpassword');
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: maxAge
    });
  };

sendEmail = (content, rspMsg, res) => {
    let transporter = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GOOGLE_APP_USER,
            pass: process.env.GOOGLE_APP_PASSWORD
        }
    });

    transporter.sendMail(content).then(() => {
        res.status(201).json({msg: rspMsg});
    }).catch(error => {
        res.status(500).json(error); 
    });
}
signup_post = async (req, res) => {
    console.log("xlu post, req.query", req.body);
    //res.send('new signup');
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    console.log("in controller, email, password, name: ", email, password, name);
    console.log("post");
    //res.status(201);
    try {
        const user = await User.createUser(email, password, name);
        const token = createToken(email);
        res.cookie('user', token, { httpOnly: true, maxAge: maxAge * 1000 });

        let message = {
            from: "Elrik",
            to: email, // receiver email
            subject: "Elrik Games Sign Up!",
            text: "Thank you for signing up to Elrik's Games: https://elrikgames1.uc.r.appspot.com/",
            html: "<b>Thank you for signing up to Elrik's Games: <a href='https://www.w3schools.com'>https://elrikgames1.uc.r.appspot.com</a></b>"
        }
        sendEmail(message, "successfully send the sign in email", res);
      }
    catch(err) {
        //const errors = handleErrors(err);
        console.log("xlu controller ", err);
        res.status(400).json({ errors: err.message });
    }
}

login_post = async (req, res) => {
    console.log("xlu post, req.query", req.body);
    //res.send('new signup');
    let email = req.body.email;
    let password = req.body.password;
    console.log("in controller login_post, email, password, ", email, password);
    try {

        const user = await User.findUser(email, password);
        //const token = createToken(user._id);
        console.log("found user xlu1, user", user);
        if (user) {
            // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            //res.cookie('user', email, { httpOnly: true, maxAge: maxAge * 1000 });
            const token = createToken(email);
            res.cookie('user', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.locals.messages = { message: "Your have successfully login" };
            res.status(201).json({success: "You have successfully login" });
        } else {
            throw new Error("Please check your email and password.")
        }
      }
    catch(err) {
        //const errors = handleErrors(err);
        console.log("xlu controller ", err);
        // res.locals.messages = { message: err.message };
        res.status(400).json({ errors: err.message });
    }
}

logout_get = (req, res) => {
    res.cookie('user', '', { maxAge: 1 });
    res.redirect('/');
}

forgetpassword_post = async (req, res) => {
    console.log("xlu post, req.query", req.body);
    //res.send('new signup');
    let email = req.body.email;
    console.log("in controller, email, password, ", email);
    console.log("post");
    //res.status(201);
    try {
        const user = await User.findUserByEmail(email);
        if (user) {
            console.log("*******forgetpassword, user is: ", user);
            const code = Math.floor(Math.random() * 10000);
            await User.updateUserCode(email, code);
            // const token = createToken(email);
            //res.cookie('user', token, { httpOnly: true, maxAge: maxAge * 1000 });

            let message = {
                from: "Elrik",
                to: email, // receiver email
                subject: "Elrik Games Password Reset",
                text: `Your verification code is ${code}. Please use link to reset your password: https://elrikgames1.uc.r.appspot.com/resetpassword?code=${code}&email=${email}`,
                html: `<b>Your verification code is ${code}. Please use link to reset your password: <a href="https://elrikgames1.uc.r.appspot.com/resetpassword?code=${code}&email=${email}">https://elrikgames1.uc.r.appspot.com/resetpassword?code=${code}&email=${email}</a></b>`
            }
            sendEmail(message, "successfully send the password reset email", res);
        } else {
            throw new Error("Please use your sign up email to reset your password");
        }
      }
    catch(err) {
        //const errors = handleErrors(err);
        console.log("xlu controller ", err);
        res.status(400).json({ errors: err.message });
    }
}

resetpassword_post = async (req, res) => {
    console.log("xlu resetpassword_post, req.query", req.body);
    //res.send('new signup');
    let email = req.body.email;
    let password = req.body.password;
    let code = req.body.code;
    //console.log("in controller, email, password, ", email);
    try {
        const user = await User.findUserByEmail(email);
        console.log("******user.code, code: ", user, user.code, code);
        if (user && user.code == code) {
            //console.log("*******resetpassword, user is: ", user);
            const result = await User.resetUserPassword(email, password, code);
            if (result) {
                const token = createToken(email);
                res.cookie('user', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(201).json({ success: "You have successfully reset your password" });
            } else {
                throw new Error("Failed to reset your password. Perhaps the link you use to reset password has been expired or used. Please reset your password again.");
            }
        } else {
            throw new Error("Failed to reset your password. Perhaps the link you use to reset password has been expired or used. Please reset your password again.");
        }
      }
    catch(err) {
        //const errors = handleErrors(err);
        //console.log("xlu controller ", err);
        res.status(400).json({ errors: err.message });
    }
}

module.exports = {
    signup_get, 
    signup_post, 
    login_get, 
    login_post, 
    logout_get,
    forgetpassword_get,
    forgetpassword_post,
    resetpassword_get,
    resetpassword_post,
};