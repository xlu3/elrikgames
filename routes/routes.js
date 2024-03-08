//import Router from "express";
const { Router } = require('express');

const authController = require('../controllers/authController');

const router = Router();
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/forgetpassword', authController.forgetpassword_get);
router.post('/forgetpassword', authController.forgetpassword_post);
router.get('/resetpassword', authController.resetpassword_get);
router.post('/resetpassword', authController.resetpassword_post);
router.get('/logout', authController.logout_get);

router.get('/addgames', authController.addgames_get);
router.post('/addgames', upload.single('gameimage'), authController.addgames_post);

router.get('/', (req, res) => { 
    res.render('home');
  });

router.get('/login', (req, res) => {
    res.render('login');
});

// router.get("/firebase/firebaseConfig", (request, response) => {
//     console.log("in firebase get");
//     response.sendFile(firebaseConfig);
// });

module.exports = router;