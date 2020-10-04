const   mongoose    = require("mongoose"),
        Campground  = require("./models/campground")
        Comment     = require("./models/comment.js");


let data = [];

function seedDB(){    
    //remove all campgrounds  
    // Campground.deleteMany({}, function(err){
    //     if(err){
    //         console.log(err);
    //     } else {
    //     console.log("removed campgrounds");
            //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        // add a few comments
                        Comment.create(
                            {
                                text: "This place is amazing. Unbeliveable",
                                author: "Daniel and Suellen"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                                }
                            
                            });
                    }
                });
            });
    //     }
    // });
}

module.exports = seedDB;