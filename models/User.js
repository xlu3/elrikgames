const Datastore = require("nedb");
const db = require('../database.js');
const bcrypt = require('bcrypt');

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


const database = new Datastore("../database.db");
database.loadDatabase();

const encryptPassword = async (password) => {
    const pw = await bcrypt.hash(password, 10);
    //console.log(pw);
    return pw;
};
//const pw = module.exports.encryptPassword("1234");
createUser = async (email, password, name) => {
    const pw = await encryptPassword(password);
    //console.log("createUser2, password is: ", pw);
    try {
        // console.log("createUser2, email, pw is: ", email, pw);

        const results = await pool.query(`insert into users  (email, name, password) VALUES (?, ?, ? )`, [email, name, pw]);

        console.log('db result1: ', results);
        // todo put all in try catch block
        if (results) {
            return true;
        } 
        else {
            throw new Error("Unable to create user");
        }
    }
    catch (err) {
        //throw new Error(err);
        if (err.code == "ER_DUP_ENTRY") {
            throw new Error("Unable to create user as user already exists")
        }
        else {
            throw new Error("Unable to create user");
        }
    }
}

findUser = async (email, password) => {
    try {
        //console.log("xlu1 findUser ************", email, password);
        const user = await db.findUser(email);
        // console.log('****************db result: ', user);
        // todo put all in try catch block
        if (user) {
            // TODO
            const isMatch = await bcrypt.compare(password, user.password);
            //console.log("********************* user.password, password: ", user.password);
            if (isMatch) {
                return true;
            }
            else {
                throw new Error("Please check your password");
            }
        } 
        else {
            throw new Error("Please check your email address");
            //throw new Error("Please check your email address");
        }
    }
    catch (err) {
        //console.log("Please check your email address and password", err);
        throw new Error(err);
    }
}

findUserByEmail = async (email) => {
    try {
        //console.log("findUserByEmail xlu1**************************");
        const user = await db.findUser(email);
        //console.log('findUserByEmail db result: ', user);
        // todo put all in try catch block
        if (user) {
           // console.log("findUserByEmail, user: ", user)
           return {id: user.id, email: user.email, code: user.code, role: user.role};
        } 
        else {
            throw new Error("Please check your email address");
            //throw new Error("Please check your email address");
        }
    }
    catch (err) {
        console.log("error **************", err)
        //throw new Error("Please check your email address");
        //throw new Error("Please check your email address");
        //throw new Error("Please try again, unexpected error happened");
    }
}

updateUserCode = async (email, code) => {
    try {
        //console.log("findUserByEmail xlu1**************************");
        const user = await pool.query(`update users  set code=? where email=?`, [code, email]);
        console.log('updateUserCode db result: ', user);
        // todo put all in try catch block
        if (user) {
            console.log("updateUserCode, user: ", user)
           return {email: user.email, code: user.code};
        } 
        else {
            throw new Error("Please use the email address you used to subscribe.");
        }
    }
    catch (err) {
        console.log("error **************", err)
        throw new Error(err);
    }
}

resetUserPassword = async (email, password) => {
    try {
        //console.log("findUserByEmail xlu1**************************");
        const pw = await encryptPassword(password);
        const result = await pool.query(`update users set code=null, password=? where email=?`, [pw, email]);
        console.log('resetUserPassword db result: ', result);
        // todo put all in try catch block
        if (result) {
            console.log("resetUserPassword, successfully, result: ", result)
           return true;
        } 
        else {
            throw new Error("Failed to reset password. The link you use to reset password might already been used. Please reset password again.");
        }
    }
    catch (err) {
        console.log("error **************", err)
        throw new Error(err);
    }
}

// module.exports.createUser("xlu4", "1234");
// module.exports.findUser("xlu4");
module.exports = {
    createUser,
    findUser,
    findUserByEmail,
    updateUserCode,
    resetUserPassword
}