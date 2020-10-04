var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
const { route } = require("./campgrounds");
var middlewareObj = require("../middleware");



//Comment New
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
            res.render("comments/new", {campground: campground});
        })
    });


//Comment Create
router.post("/", middlewareObj.isLoggedIn,  function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comments
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("success", "Successfully created comment");
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
            // connect new comments to campground
            // redirect to campground show page
        }
    });
    
});

//COMMENTS EDIT ROUTE

router.get("/:comment_id/edit", middlewareObj.isLoggedIn, middlewareObj.checkUser, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", "You don`t have permission to do that");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
    
});

//COMMENT UPDATE ROUTE 

router.put("/:comment_id", middlewareObj.isLoggedIn, middlewareObj.checkUser, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment edited successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//COMMENT DELETE ROUTE 

router.delete("/:comment_id", middlewareObj.isLoggedIn, middlewareObj.checkUser, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deleteComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment succesfully deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});




module.exports = router;
