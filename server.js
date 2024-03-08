const express = require("express");
const session = require("express-session");
const flash = require('connect-flash')

const bodyParser = require("body-parser");
const Datastore = require("nedb");
const env = require("dotenv");
env.config();
const db = require('./database.js');
//import firebaseConfig from "./firebase/firebaseConfig.js";
//import router from "./routes/routes.js"
const routes = require('./routes/routes.js');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

env.config();
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true,}))
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

const database = new Datastore("database.db");
// const jsonParser = bodyParser.json();
const port = process.env.PORT || 3000;
const server = app.listen(port);
database.loadDatabase();

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}));

app.use(flash()); 
app.use(function(req, res, next){
    res.locals.messages = req.flash();
    // console.log("***********res.locals.messages=", res.locals.messages);
    next();
  });
app.get('*', checkUser);

app.use(routes);