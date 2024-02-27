import mysql from 'mysql2';
//const mysql = require('mysql2');
import env from 'dotenv';
//const env = require("dotenv").config();
env.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST || '',
    user: process.env.MYSQL_ADDON_USER || '',
    password: process.env.MYSQL_ADDON_PASSWORD || '',
    database: process.env.MYSQL_ADDON_DB || '',
    port: process.env.MYSQL_ADDON_PORT || '8080'
}).promise();

export async function getStats(name) {
    console.log("in getStats: ", name);
    const [rows] = await pool.query('select * from stats where name = ?', name);
    console.log(" I am here", name, rows[0]);
    return rows[0];
}

getStats('grabblyBird', 'views');

export async function insertRow(name, views, likes) {
    // INSERT INTO `stats` (`name`, `views`, `likes`) VALUES ('grapplyBird', '0', '0');
    const result = await pool.query(`insert into stats  (name, views, likes) VALUES (?, ?,  ? )`, [name, views, likes]);
    console.log(result);
}

//insertRow('grapplyBird', 0, 0);
//insertRow('gunSlap', 0, 0);

export async function updateRow(name, views, likes) {
    // INSERT INTO `stats` (`name`, `views`, `likes`) VALUES ('gunSlap', '0', '0');
    const result = await pool.query(`update stats  set views=?, likes=? where name=?`, [views, likes, name]);
    console.log(result);
}

//updateRow('grapplyBird', 1, 0);

//export { getStats };