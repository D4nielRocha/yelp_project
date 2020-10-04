var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root Route 
router.get("/", function(req, res){
    res.render("landing");
});


// Shows register form 
router.get("/register", function(req, res){
    res.render("register");
});


// handle sign up logic
router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // req.flash("error", err.message);
            return res.render("register" ,{error: err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username);
            res.redirect("/campgrounds");
        });
    });
});


// Show Login Form
router.get("/login", function(req, res){
    res.render("login");
});

//handling login logic 
router.post("/login", function(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome back " + req.body.username + "!"
  })(req, res); 
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have been Logged Out");
    res.redirect("/campgrounds");
});



module.exports = router;