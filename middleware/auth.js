let jwt = require('jsonwebtoken');
const { User } = require("../models");

module.exports = function(req, res, next){
    console.log("Auth MIddleware hit!")
    if( req.method == 'OPTIONS' ){
        console.log("Auth Options hit!")
        next();
    } else{
        console.log(req.headers);
        let sessionToken = req.headers.authorization;
        console.log(sessionToken);
        if( !sessionToken ) {
            return res.status(403).send({ auth: false, message: 'No token provided.' });
        }
        else{
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
                if(decoded){
                    User.findOne({ where: { id: decoded.id } }).then( (user) => {
                        req.user = user;
                        next();
                    }, () => {
                        res.status(401).send({error: "Not Authorized!"});
                    });
                } else {
                    res.status(400).send({error: "Not Authorized!"});
                }
            });
        }
    }
};