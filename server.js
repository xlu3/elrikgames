const express = require("express");
//import express from 'express';
const bodyParser = require("body-parser");
//import bodyParser from 'body-parser';
const Datastore = require("nedb");
//import Datastore from 'nedb';
const env = require("dotenv");
env.config();
//import env from 'dotenv';
// import {getStats, insertRow, updateRow} from './database.js';
const db = require('./database.js');
//import firebaseConfig from "./firebase/firebaseConfig.js";
//import router from "./routes/routes.js"
const routes = require('./routes/routes.js');

env.config();
const app = express();
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');

const database = new Datastore("database.db");
const jsonParser = bodyParser.json();
const port = process.env.PORT || 3000;
const server = app.listen(port);
database.loadDatabase();

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

app.put("/stats", jsonParser, async (request, response) => {

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