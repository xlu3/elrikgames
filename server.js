// const express = require("express");
import express from 'express';
//const bodyParser = require("body-parser");
import bodyParser from 'body-parser';
// const Datastore = require("nedb");
import Datastore from 'nedb';
//const env = require("dotenv").config();
import env from 'dotenv';
//const env = require("dotenv").config();
import {getStats, insertRow, updateRow} from './database.js';
//import firebaseConfig from "./firebase/firebaseConfig.js";
import * as path from 'path';

env.config();
const app = express();
app.use(express.static('public'));

const database = new Datastore("database.db");
  
const jsonParser = bodyParser.json();
const port = process.env.PORT || 3000;

const server = app.listen(port);

database.loadDatabase();

// app.get('/', (req, response) => {
//     console.log("xlu", `#{publicPath}/index.html`);
//     response.sendFile(__dirname + `/public/index.html`); // images not working
// });

// app.get('/public/firebase/firebaseConfig.js', (req, response) => {
//     console.log("xlu2", `#{publicPath}/index.html`);
//     response.sendFile(__dirname + `/public/firebase/firebaseConfig.js`); // images not working
// });

app.get("/stats", async (request, response) => {

    const gameType = request.query.name;

    console.log(gameType);
    // const result = await getStats('grapplyBird', 'views');
    const results = await getStats(gameType, 'views');
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
    const results = await getStats(gameType, 'views');
    console.log('db result: ', results);
    // todo put all in try catch block
    if (results) {
        const output = {name: results.name, clicks: results.views + 1};
        // console.log("output:", output);
        const views = results.views + 1;
        updateRow(gameType, views, 0);

        response.json(output);
    } else {
        const output = {name: gameType, clicks: 1};
        insertRow(gameType, 1, 0);
        response.json(returnValue)
    }
});

// app.get("/firebase/firebaseConfig", (request, response) => {
//     console.log("in firebase get");
//     response.sendFile(firebaseConfig);
// });