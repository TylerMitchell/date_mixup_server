//TODO: Input Validation
//TODO: Security Pass
require('dotenv').config();
require("./models/associations");

let db = require("./db");
let Middleware = require("./middleware");
let Controllers = require("./controllers");

let express = require('express');
let server = express();

server.use( (req, res, next) => {
    if( req.headers.host !== 'localhost' || "127.0.0.1" ){ 
        if (req.header('x-forwarded-proto') !== 'https') {
            console.log("before redirect");
            res.redirect(`https://${req.header('host')}${req.url}`)
        } else { next(); }
    } else{ next(); }
});

server.use( express.json() );
server.use(Middleware.CORS);
server.use("/user", Controllers.User)

server.use(Middleware.Auth);
server.use("/profile", Controllers.Profile);
server.use(Middleware.MainProfile)
server.use("/contacts", Controllers.Contact);
server.use("/messages", Controllers.Message);

db.authenticate()
    .then( () => { db.sync({ force: true }); } )
    .then( () => {
        server.listen( process.env.PORT, () => {
            console.log(`The dateMixup server is currently running on localhost: ${process.env.PORT}`);
        });
        
    })
    .catch( (err) => {
        console.log("Unable to connect to database!");
        console.log(err);
    });

