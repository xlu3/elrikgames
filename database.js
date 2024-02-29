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

module.exports.getStats = async function (name) {
    console.log("in getStats: ", name);
    const [rows] = await pool.query('select * from stats where name = ?', name);
    console.log(" I am here", name, rows[0]);
    return rows[0];
}

// module.exports.getStats('grapplyBird');

module.exports.insertRow = async function (name, views, likes) {
    // INSERT INTO `stats` (`name`, `views`, `likes`) VALUES ('grapplyBird', '0', '0');
    const result = await pool.query(`insert into stats  (name, views, likes) VALUES (?, ?,  ? )`, [name, views, likes]);
    console.log(result);
}

//insertRow('grapplyBird', 0, 0);
//insertRow('gunSlap', 0, 0);

module.exports.updateRow = async function (name, views, likes) {
    // INSERT INTO `stats` (`name`, `views`, `likes`) VALUES ('gunSlap', '0', '0');
    const result = await pool.query(`update stats  set views=?, likes=? where name=?`, [views, likes, name]);
    console.log(result);
}

//updateRow('grapplyBird', 1, 0);

//export { getStats };