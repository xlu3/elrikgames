//import Router from "express";
const { Router } = require('express');

const authController = require('../controllers/authController');
const gamesController = require('../controllers/gamesController');
const usersController = require('../controllers/usersController');

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

router.get('/', gamesController.games_get);
router.get('/games', gamesController.games_get);
router.get('/addgames', gamesController.addgames_get);
router.post('/addgames', upload.single('gameimage'), gamesController.addgames_post);
router.put('/gameviews/:id', gamesController.gameviews_put);
router.delete('/games/:id', gamesController.games_delete);
router.get('/game', gamesController.games_edit_get);
router.post('/updateGame', upload.single('gameimage'), gamesController.updategames_put);
router.get('/users', usersController.get_users);

router.get('/login', (req, res) => {
    res.render('login');
});

// router.get("/firebase/firebaseConfig", (request, response) => {
//     console.log("in firebase get");
//     response.sendFile(firebaseConfig);
// });

module.exports = router;