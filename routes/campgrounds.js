var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
const middlewareObj = require("../middleware");


// Create new campground 
router.post("/", middlewareObj.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    let name = req.body.name
    let price = req.body.price
    let image = req.body.image
    let description = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, price: price, image: image, description: description, author: author}
    // Create a new campground and save it to the DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });   
});

// Shows form to crate new campground
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})


//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err);
        } else {
            console.log(campground);
            res.render("campgrounds/show", {campground: campground});
        }});
    });

//INDEX - Show all campgrounds
router.get("/", function(req, res){
        // Get all campgrounds from DB
        Campground.find({}, function(err, camp){
            if(err){
            console.log(err)
         } else {
            res.render("campgrounds/index", {campgrounds:camp});
         }
        });
        
});


// EDIT CAMPRGOUND ROUTE 
router.get("/:id/edit", middlewareObj.checkUserOwnership, function(req, res){
            Campground.findById(req.params.id, function(err, foundCampground){
                res.render("campgrounds/edit", {campground: foundCampground});  
            });
        });

    
    



// UPDATE CAMPGROUND ROUTE

router.put("/:id", middlewareObj.checkUserOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})



// DELETE ROUTE

router.delete("/:id", middlewareObj.checkUserOwnership, middlewareObj.isLoggedIn, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        console.log(req.params.id);
        res.redirect("/campgrounds");
        });
});


module.exports = router;