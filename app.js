var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Note = require("./models/note");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocal = require("passport-local-mongoose");
var User = require("./models/user");
var seedDB = require("./seeds");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");

// server configuration
mongoose.connect("mongodb://localhost/note_space_v1");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
seedDB();

// passport configuration
app.use(require("express-session")({
    secret: "once again",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// for every route to pass in req.user
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// APP ROUTES

// landing route
app.get("/", function(req,res){
   res.render("index");
});

// notes GET route
app.get("/notes", function(req,res){
    // get all the notes from the database
    Note.find({}, function(err, AllNotes){
        if(err){
            console.log(err);
        }else {
        res.render("notes/notes", {notes:AllNotes, currentUser: req.user});      
        }
    });
});

// notes POST route
app.post("/notes", function(req,res){
  var name = req.body.Name;
  var image = req.body.image;
  var desc = req.body.desc;
  var newNote = {Name: name, image: image, desc: desc};
    //create a new notes and save to the database
    Note.create(newNote, function(err, newlyCreate){
       if(err){
          console.log(err); 
       } else {
         res.redirect("/notes");    
       }
    });
});

// routes for adding new notes
app.get("/notes/new", function(req, res){
    res.render("notes/new");
});

// show route
app.get("/notes/:id", function(req, res){
    Note.findById(req.params.id).populate("comments").exec(function(err, foundNote){
        if(err){
            console.log(err);
        } else {
            console.log(foundNote);
            res.render("notes/show", {note: foundNote});
        }
    });
});

// edit route
app.get("/notes/:id/edit", function(req, res){
    Note.findById(req.params.id, function(err, foundNote){
        if(err){
            res.redirect("/notes");
        } else {
            res.render("notes/edit", {note:foundNote});
        }
    });
});

// update route
app.put("/notes/:id", function(req, res){
    req.body.note.desc = req.sanitize(req.body.note.desc);
    Note.findByIdAndUpdate(req.params.id, req.body.note, function(err, updateNote){
        if(err){
            res.redirect("/notes");
        } else {
            res.redirect("/notes/" + req.params.id);
        }
    });
});

// delete route
app.delete("/notes/:id", function(req, res){
    Note.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/notes");
        } else {
            res.redirect("/notes");
        }
    });
});

// comment routes
app.get("/notes/:id/comments/new", isLoggedIn, function(req, res){
    Note.findById(req.params.id, function(err,note){
        if(err){
            console.log(err);   
        }else {
            res.render("comments/new", {note: note});
        }
    });
});

// comment POST route
app.post("/notes/:id/comments", isLoggedIn, function(req, res){
    // look up campgrounds using ID
    Note.findById(req.params.id, function(err, note){
        if(err){
            console.log(err);    
            res.redirect("/notes");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else{
                note.comments.push(comment);
                note.save();
                res.redirect("/notes/" + note._id);
            } 
            });
        }
    });
});

// Routes for Authentication
// show registration form
app.get("/register", function(req, res){
    res.render("register");
});

// handling the user sign-up
app.post("/register", function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser , req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/notes"); 
        });
    });
});

// login routes
app.get("/login", function(req, res){
    res.render("login");
});

// login middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/login"
}) ,function(req, res){
});

// logout routes
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/notes");
});

// Login-checking middleware
function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
     res.redirect("/login");   
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is running!");
});