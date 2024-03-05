//import Router from "express";
const { Router } = require('express');

const authController = require('../controllers/authController');

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

router.get('/', (req, res) => { 
    console.log("home================");
    res.render('home');
  });

router.get('/login', (req, res) => {
    console.log("login================");
    res.render('login');
});

// router.get("/firebase/firebaseConfig", (request, response) => {
//     console.log("in firebase get");
//     response.sendFile(firebaseConfig);
// });

module.exports = router;