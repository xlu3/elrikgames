const jwt = require('jsonwebtoken');
const mailer = require("nodemailer");

const User = require('../models/User.js');
// controller actions
module.exports.signup_get = (req, res) => {
    res.render('signup');
}
module.exports.login_get = (req, res) => {
    res.render('login');
}
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: maxAge
    });
  };

module.exports.signup_post = async (req, res) => {
    console.log("xlu post, req.query", req.body);
    //res.send('new signup');
    let email = req.body.email;
    let password = req.body.password;
    console.log("in controller, email, password, ", email, password);
    console.log("post");
    //res.status(201);
    try {
        const user = await User.createUser(email, password);
        const token = createToken(email);
        res.cookie('user', token, { httpOnly: true, maxAge: maxAge * 1000 });
        // send email
        let transporter = mailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GOOGLE_APP_USER,
                pass: process.env.GOOGLE_APP_PASSWORD
            }
        });
        let message = {
            from: "Elrik",
            to: email, // receiver email
            subject: "Elrik Games Sign Up!",
            text: "Thank you for signing up to Elrik's Games",
            html: "<b>Thank you for signing up to Elrik's Games</b>"
        }
        transporter.sendMail(message).then(() => {
            res.status(201).json({msg: "sucessfully send the msg"});
        }).catch(error => {
            res.status(500).json(error); // xxx
        });
        
      }
    catch(err) {
        //const errors = handleErrors(err);
        console.log("xlu controller ", err);
        res.status(400).json({ errors: err.message });
    }
}

module.exports.login_post = async (req, res) => {
    console.log("xlu post, req.query", req.body);
    //res.send('new signup');
    let email = req.body.email;
    let password = req.body.password;
    console.log("in controller login_post, email, password, ", email, password);
    //res.status(201);
    try {

        const user = await User.findUser(email, password);
        //const token = createToken(user._id);
        console.log("found user xlu1, user", user);
        if (user) {
            // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            //res.cookie('user', email, { httpOnly: true, maxAge: maxAge * 1000 });
            const token = createToken(email);
            res.cookie('user', token, { httpOnly: true, maxAge: maxAge * 1000 });

            res.status(201).json({ });
        } else {
            throw new Error("Please check your email and password.")
        }
      }
    catch(err) {
        //const errors = handleErrors(err);
        console.log("xlu controller ", err);
        res.status(400).json({ errors: err.message });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('user', '', { maxAge: 1 });
    res.redirect('/');
}
