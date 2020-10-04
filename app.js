const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      flash         = require("connect-flash"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      method        = require("method-override"),
      User          = require("./models/user"),
      seedDB        = require("./seeds")
      
let commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index")



mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", { useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(method("_method"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "We will be engaged when we come back",
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(function(req, res, next){
    res.locals.cUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);







// Campground.create(
//     {
//         name:"Daniel Rocha", 
//         image: "https://i.pinimg.com/474x/96/1f/2d/961f2d455b6e271ff5f26310eccab545--adventure-photography-travel-photography.jpg",
//         description: "This is a nice camping site, really lovely and well equipped" 
//     }, 
//     function(err, camp){
//         if(err){
//         console.log("Something went wrong");
//         console.log(err);
//         } else {
//         console.log("New Campground created");
//         console.log(camp);
//         }
// });


//     const campgrounds = [
//         {name:"Daniel Rocha", image: "https://i.pinimg.com/474x/96/1f/2d/961f2d455b6e271ff5f26310eccab545--adventure-photography-travel-photography.jpg" },
//         {name:"Suellen Massuci", image: "https://i.pinimg.com/originals/25/cd/de/25cddea995f0b67ebcc42f1464e06438.jpg" },
//         {name:"Massuci Rocha", image: "https://i.pinimg.com/originals/19/b5/2b/19b52b9a1f73dd99be6eae90dea0479f.jpg"}
//     ]



app.listen(3000, function(){
    console.log("YelpCamp Server has Started!");
});