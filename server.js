const express = require("express");
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
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

const database = new Datastore("database.db");
// const jsonParser = bodyParser.json();
const port = process.env.PORT || 3000;
const server = app.listen(port);
database.loadDatabase();

app.get('*', checkUser);

app.get("/stats", async (request, response) => {
    const gameType = request.query.name;

    console.log(gameType);
    // const result = await getStats('grapplyBird', 'views');
    const results = await db.getStats(gameType, 'views');
    console.log('db result: ', results);
    // todo put all in try catch block
    if (results) {
        const output = {name: results.name, clicks: results.views};
        console.log("output:", output);
        response.json(output);
    } 
});

app.put("/stats", async (request, response) => {
    const gameType = request.body["type"];

    console.log(gameType);

    // 
    const results = await db.getStats(gameType, 'views');
    console.log('db result: ', results);
    // todo put all in try catch block
    if (results) {
        const output = {name: results.name, clicks: results.views + 1};
        // console.log("output:", output);
        const views = results.views + 1;
        db.updateRow(gameType, views, 0);

        response.json(output);
    } else {
        const output = {name: gameType, clicks: 1};
        insertRow(gameType, 1, 0);
        response.json(returnValue)
    }
});

app.use(routes);