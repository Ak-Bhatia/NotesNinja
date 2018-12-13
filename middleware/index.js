var Comment = require("../models/comment"),
    Post = require("../models/post"),
    Blog    = require("../models/blog");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You must be Logged in");
    res.redirect("/login");
};

middlewareObj.isAdimin = function(req,res,next) {
    if(req.isAuthenticated()){
        if(req.user.isAdmin){
            return next();
    }}
    req.flash("error","Only admin can do this");
    res.redirect("back");
};

middlewareObj.isShopkeeper = function(req,res,next) {
    if(req.user.isShopkeeper === true){
        return next();
    }else{
    res.redirect("/home");
    }
};

middlewareObj.commentAuthorisation = function(req,res,next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id,function(err, foundComment) {
            if(err){
                req.flash("error","Something unexpected happen");
                res.redirect("back");
            }
            else if (foundComment.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash("error","Only owner can do this");
                res.redirect("back");
            }
        });
    } else {
        req.flash("You need to be Logged in");
    }
};

middlewareObj.postAuthorisation = function(req,res,next) {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id,function(err, foundPost) {
            if(err){
                req.flash("error","Something unexpected happen");
                return res.redirect("back");
            }
            else if (foundPost.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash("error","Only owner can do this");
                res.redirect("back");
            }
        });
    } else {
        req.flash("You need to be Logged in");
    }
};

middlewareObj.blogAuthorisation = function(req,res,next) {
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id,function(err, foundBlog) {
            if(err){
                req.flash("error","Something unexpected happen");
                res.redirect("back");
            }
            else if (foundBlog.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash("error","Only owner can do this");
                res.redirect("back");
            }
        });
    } else {
        req.flash("You need to be Logged in");
    }
};

module.exports = middlewareObj;



