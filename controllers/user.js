const { Router } = require("express");
const { Auth } = require("../middleware")
const { User } = require("../models");

let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

UserController = Router();

UserController.get("/test", (req, res) => {
    let out = "Test route hit";
    console.log(out);
    res.status(200).json(out);
});

UserController.post("/register", (req, res) => {
    console.log("Hit the register route");
    User.create({
        email: req.body.user.email,
        passwordhash: bcrypt.hashSync(req.body.user.password, 10),
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName
    }).then( 
        function success(user){
            user.passwordhash = "superSecret!";
            res.json({
                user: user,
                message: 'created'
            });
        }, 
        function error(err){
            console.log(err);
            res.status(500).json(err)
        }
    );
});

UserController.post("/login", (req, res) => {
    console.log("Hit the login route");
    User.findOne( { where: { email: req.body.user.email } } ).then( 
        function success(user){
            if(user){ 
                bcrypt.compare( req.body.user.password, user.passwordhash, (err, matches) => {
                    console.log("The value matches: ", matches);
                    if( matches ){ 
                        let token = jwt.sign( { id: user.id }, process.env.JWT_SECRET, { expiresIn: 60*60*24 } );
                        user.passwordhash = "superSecret!";
                        res.json({ user: user, message: "successfully authenticated", sessionToken: token} ); 
                    }
                    else{ console.log(err); res.status(500).json({ error: "Failed to Authenticate!" }); }
                });
                //res.json(user); 
            }
            else{ res.status(502).json({ error: "Failed to Authenticate!" }); }
        }, 
        function error(err){
            res.status(500).json(err);
        }
    )
});

//behind auth
UserController.get("/", Auth, (req, res) => {
    console.log("Hit the base route");
    if(req.user){
        req.user.passwordhash = "superSecret!";
        res.status(200).json({ user: req.user, message: "Currently Logged In User." });
    } else{
        res.status(500).json({ message: "User Not Found!" });
    }
});

UserController.put("/changepassword", Auth, (req, res) => {
    console.log("Hit the changepassword route");
    if( req.user ){
        bcrypt.compare( req.body.user.oldPassword, req.user.passwordhash, (err, matches) => {
            console.log("The value matches: ", matches);
            if( matches ){ 
                User.update(
                    { passwordhash: bcrypt.hashSync(req.body.user.newPassword, 10) },
                    { where: { id: req.user.id } }
                ).then( (user) => {
                    user.passwordhash = "superSecret!";
                    res.json({ message: "Password Updated!"} ); 
                })
                .catch( (err) => {
                    console.log(err);
                    res.status(500).json({ message: "unable to find user!", id: req.user.id })
                });
            }
            else{ console.log(err); res.status(500).json({ error: "Old Passwords Didn't Match!" }); }
        });
    } else{ res.status(500).json({ message: "User Not Found!" }); }
    
});

UserController.delete("/deleteaccount", Auth, (req, res) => {
    console.log("Hit the deleteaccount route");
    if( req.user ){
        bcrypt.compare( req.body.user.password, req.user.passwordhash, (err, matches) => {
            console.log("The value matches: ", matches);
            if( matches && req.body.user.email === req.user.email ){ 
                User.destroy({ where: { id: req.user.id } })
                .then( () => { res.status(200).json({ message: "User Deleted"} ); })
                .catch( (err) => {
                    console.log(err);
                    res.status(500).json({ message: "unable to find user!", id: req.user.id })
                });
            }
            else{ console.log(err); res.status(500).json({ error: "Passwords Or Emails Didn't Match!" }); }
        });
    } else { res.status(500).json({ message: "User Not Found!" }); }
});

module.exports = UserController;