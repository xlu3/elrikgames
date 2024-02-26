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

env.config();

const app = express();

app.use(express.static('public'));
const jsonParser = bodyParser.json();

// const port = 3000;
const port = process.env.PORT || 3000;

const server = app.listen(port);

const database = new Datastore("database.db");
database.loadDatabase();




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

    /*
    database.findOne({ 'name' : gameType}, function(err, doc) {


        if (err) {
            console.log(err);
            return;
        }
        
        console.log(doc);

        response.json(doc);

    });
    */
    
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

    // database.findOne({ 'name': gameType}, function(err, doc) {


    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
        
    //     console.log(doc);

    //     if (doc) {
    //         console.log("add 1 to " + gameType);

    //         const returnValue = doc;


            

    //         returnValue['clicks'] += 1;

    //         console.log(returnValue['clicks']);

    //         const id  = returnValue['_id'];

    //         database.update(
    //             {'_id': id}, 
    //             { $set: { 'clicks': returnValue['clicks']} },
    //             {},// this argument was missing
    //             function (err, numReplaced) {
    //                 console.log("replaced---->" + numReplaced);
    //             }
    //         );

    //         database.loadDatabase();

    //         response.json(returnValue);

    //     }
    //     else {
    //         const returnValue = {};

    //         returnValue['name'] = gameType;
    //         returnValue['clicks'] = 1;

    //         database.insert(returnValue);

    //         database.loadDatabase();

    //         response.json(returnValue)
    //     }
    // });
});