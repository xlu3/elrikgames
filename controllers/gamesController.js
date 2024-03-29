const mysql = require('mysql2');
const env = require('dotenv');
const session = require('express-session');

env.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST || '',
    user: process.env.MYSQL_ADDON_USER || '',
    password: process.env.MYSQL_ADDON_PASSWORD || '',
    database: process.env.MYSQL_ADDON_DB || '',
    port: process.env.MYSQL_ADDON_PORT || '8080'
}).promise();

games_get = async (req, res) => {
    try {        
        const rows = await pool.query(`SELECT games.id as id, games.description, games.name as game_name, link, views, likes, user_id, games.role as game_role, users.name as user_name, games.image FROM games join users where games.user_id = users.id order by games.id`);
        if (rows) {
            res.locals.games = rows[0];
            console.log("******rows: ", rows[0]);

            res.render('games');
        } else {
            throw new Error("Failed to add a game.");
        }
      }
    catch(err) {
        res.status(400).json({ errors: err.message });
    }
}

addgames_get = (req, res) => {
    res.render('addgames');
}
games_detail_get = async (req, res) => {
    let gameid = req.query.id;
    let user_id = req.query.user_id;
    console.log("xlu games_detail_get ************* gameid: ", gameid)

    //res.send('new signup');
    
    try {
        console.log("in controller, games_edit_get, gameid: ", gameid);
        const result = await pool.query(`select * from games where id=?`, gameid);
        //const result = await pool.query(`update games set name=?, link=?, description=?, image=? where id=?`, [name, link, description, image, gameid]);
    
        console.log('db result:', result);
        // todo put all in try catch block
        if (result) {
            const result2 = await pool.query(`select comments.id, comments.user_id, comments.description, DATE_FORMAT(comments.updated_at, "%Y-%m-%dT%TZ") as updated_at, DATE_FORMAT(comments.created_at, "%Y-%m-%dT%TZ") as created_at, users.name from comments join users where game_id=? and comments.user_id = users.id order by comments.id desc`, [gameid, user_id]);
            res.locals.game = result[0][0];
            res.locals.comments = result2[0];
            console.log("result2 gamedetail comments: ", result2[0]);
            res.render("gamedetail");
        } else {
            throw new Error("Unable to update views count");
        }
      }
    catch(err) {
        res.status(400).json({ errors: err.message });
    }
}
games_edit_get= async (req, res) => {
    let gameid = req.query.id;
    console.log("xlu************* gameid: ", gameid)

    console.log("xlu games_edit_get, req.query"); //, req.body
    //res.send('new signup');
    
    try {
        console.log("in controller, games_edit_get, gameid: ", gameid);
        const result = await pool.query(`select * from games where id=?`, gameid);
        //const result = await pool.query(`update games set name=?, link=?, description=?, image=? where id=?`, [name, link, description, image, gameid]);
    
        console.log('db result:', result);
        // todo put all in try catch block
        if (result) {
            res.locals.game = result[0][0];
            res.render("editgame");
        } else {
            throw new Error("Unable to update views count");
        }
      }
    catch(err) {
        res.status(400).json({ errors: err.message });
    }
}

updategames_put = async (req, res) => {
    console.log("xlu updategames_put, req.query"); //, req.body
    //res.send('new signup');
    let gameid = req.body.id;
    let name = req.body.name;
    let description = req.body.description;
    let link = req.body.link;

    // let image = req.body.image;
    let image = req.file.buffer.toString('base64');
    //console.log("in controller, addgames_post, name, description, image", name, description, image);
    try {
        console.log(JSON.stringify(req.file.buffer.toString('base64')));
        res.locals.result = "You have successfully uploaded a game";

        console.log(link);

        const result = await pool.query(`update games set name=?, link=?, description=?, image=? where id=?`, [name, link, description, image, gameid]);
        //console.log("******result: ", result);
        if (result) {
            req.flash('success', 'You have successfully updated a game');
            res.redirect('/');
        } else {
            throw new Error("Failed to add a game.");
        }
      }
    catch(err) {
        res.status(400).json({ errors: err.message });
    }
}

addcomment_post = addgames_post = async (req, res, next) => {
    console.log("xlu addcomment_post, req.body: ", req.body); //, req.body
    //res.send('new signup');
    let user_id = req.body.user_id;
    let game_id = req.body.game_id;
    let description = req.body.description;

    try {
        const result = await pool.query(`insert into comments  (user_id, game_id, description) VALUES (?, ?, ?)`, [user_id, game_id, description]);
        //console.log("******result: ", result);
        if (result) {
            res.status(200).json({ success: "You have successfully added a comment"});
        } else {
            throw new Error("Failed to add a comment.");
        }
      }
    catch(err) {
        res.status(400).json({ errors: err.message });
    }
}
addgames_post = async (req, res, next) => {
    console.log("xlu addgames_post, req.query"); //, req.body
    //res.send('new signup');
    let name = req.body.name;
    let description = req.body.description;
    let link = req.body.link;
    let user_id = req.body.user_id;

    // let image = req.body.image;
    let image = req.file.buffer.toString('base64');
    //console.log("in controller, addgames_post, name, description, image", name, description, image);
    try {
        console.log(JSON.stringify(req.file.buffer.toString('base64')));
        res.locals.result = "You have successfully uploaded a game";

        const result = await pool.query(`insert into games  (name, link, description, image, user_id) VALUES (?, ?, ?, ?, ?)`, [name, link, description, image, user_id]);
        //console.log("******result: ", result);
        if (result) {
            req.flash('success', 'You have successfully added a game');
            res.redirect('/');
        } else {
            throw new Error("Failed to add a game.");
        }
      }
    catch(err) {
        res.status(400).json({ errors: err.message });
    }
}


gameviews_put = async (req, res, next) => {
    console.log("xlu gameviews_put, req.body, ", req.body); //, req.body
    //res.send('new signup');
    
    try {
        let gameid = req.params.id;
        let user_id = req.body.user_id;
        console.log("in controller, gameviews_put, gameid: ", gameid, user_id);
        const results = await pool.query(`select views from games where id=?`, [gameid]);
    
        console.log('db result: , views, ', results, results[0][0].views);
        // todo put all in try catch block
        if (results) {
            const views = results[0][0].views + 1;
            console.log("new view count: ", views);
            const result = await pool.query(`update games set views=? where id=?`, [views, gameid]);
            //const result = await pool.query(`insert into views set game_id=?, user_id=? where id=?`, [gameid, user_id]);
            //console.log("user_id, gameid", user_id, gameid);
            if (user_id) {
                const result2 = await pool.query(`insert into views (user_id, game_id) VALUES (?, ?)`, [user_id, gameid]);
            }
            res.json({views: views});
        } else {
            throw new Error("Unable to update views count");
        }
      }
    catch(err) {
        res.status(400).json({ errors: err.message });
    }
}

games_delete = async (req, res, next) => {
    console.log("xlu games_delete, req.query"); //, req.body
    let gameid = req.params.id;

    console.log("in controller, gameid", gameid);
    try {
        const result = await pool.query(`DELETE FROM games where id=?`, [gameid]);
        if (result) {
            console.log("******success result: ", result);

            req.flash('success', 'You have successfully deleted a game');
            // res.redirect('/');
            res.status(200).json({ success: 'You have successfully deleted a game' });
        } else {
            throw new Error("Failed to delete a game.");
        }
      }
    catch(err) {
        console.log("err: ", err)
        res.status(400).json({ errors: err.message });
    }
}

comment_delete = async (req, res, next) => {
    // console.log("xlu games_delete, req.query"); //, req.body
    let commentid = req.params.id;

    // console.log("in controller, gameid", commentid);
    try {
        const result = await pool.query(`DELETE FROM comments where id=?`, commentid);
        if (result) {
            // console.log("******success result: ", result);

            req.flash('success', 'You have successfully deleted a comment');
            res.status(200).json({ success: 'You have successfully deleted a comment' });
        } else {
            throw new Error("Failed to delete a comment.");
        }
      }
    catch(err) {
        console.log("err: ", err)
        res.status(400).json({ errors: err.message });
    }
}

module.exports = {
    games_get,
    addgames_get,
    addgames_post,
    gameviews_put,
    games_delete,
    games_edit_get,
    updategames_put,
    games_detail_get,
    addcomment_post,
    comment_delete
};