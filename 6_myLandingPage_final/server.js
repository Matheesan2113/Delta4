var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

// import entire SDK
var AWS = require('aws-sdk');
// import AWS object without services
var AWS = require('aws-sdk/global');
// import individual service
var S3 = require('aws-sdk/clients/s3');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/deltaboard", {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//Passport config
app.use(require("express-session")({
    secret:"Once again",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get('/', function (request,response){
    var background = request.url == "/" ? "home" : "";
    response.render('index.ejs', {background: background});
});

app.get('/dashboard', function(request, response){
    var background = request.url == "/" ? "home" : "";
    response.render('main.ejs', {background: background});    
});

//AUTH ROUTES

//show register form
app.get("/register", function(req, res) {
    var background = req.url == "/" ? "home" : "";
    res.render("register.ejs", {background: background});
});

//hanle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User ({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/login");
        });
    });
});

app.get("/login", function(req, res) {
    var background = req.url == "/" ? "home" : "";
    res.render("login.ejs", {background: background});
});

app.post("/login", passport.authenticate("local", 
    {successRedirect: "/dashboard",
    failureRedirect: "/login"}), function(req,res) {

});

//logout
app.get("/logout", function(req,res) {
    req.logout();
    res.redirect("/");
})
app.listen(3000,function(){
    console.log("First API running on port 3000");
    console.log(__dirname);
});