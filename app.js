var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    notes = require("./models/routes/notes"),
    authentication = require("./models/routes/authentication"),
    comments = require("./models/routes/comments"),
    blog = require("./models/routes/blog"),
    shopkeeper = require("./models/routes/shopkeeper"),
    payment = require("./models/routes/payment"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    expressSession = require("express-session"),
    User = require("./models/user"),
    Comment = require("./models/comment"),
    flash   = require("connect-flash"),
    methodOverride = require('method-override');

var url = process.env.DATABASEURL || "mongodb://localhost/blog_app";

mongoose.connect(url);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

// CONFIGURE PASSPORT
app.use(expressSession({
    secret:"my name is bharat",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// var seed = require("./models/seedDB");

// seed();
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    return next();
});

app.use("/home",notes);
app.use(authentication);
app.use(comments);
app.use("/blogs",blog);
app.use('/shopkeeper',shopkeeper);
app.use(payment);

app.listen(process.env.PORT, process.env.IP,function () {
    console.log("server has started");
});
