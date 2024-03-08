const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
  
    // check json web token exists & is verified
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          console.log(decodedToken);
          next();
        }
      });
    } else {
      res.redirect('/login');
    }
  };

const checkUser = (req, res, next) => {
    const token = req.cookies.user;
    
    if (token) {
        console.log("check user req.cookies, token: ", req.cookies, token);

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            //console.log("verify token", decodedToken);

            if (err) {
                //console.log("jwt verify failed");
                res.locals.user = null;
                next();
            } else {
                // let user = await User.findById(decodedToken.id);
                const user = await User.findUserByEmail(decodedToken.id);
                //console.log("xlu set user in res local, ", user);
                res.locals.user = user;
                next();
            }
        });
    } else {
      console.log("check user doesn't get token");
      res.locals.user = null;
      next();
    }
  };
  
  module.exports = { requireAuth, checkUser };