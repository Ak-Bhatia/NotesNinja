var express = require("express"),
    Post = require("../post"),
    Comment = require("../comment"),
    middleware = require("../../middleware"),
    Blog = require("../blog"),
    router = express.Router();

//Notes comments

router.post("/home/:id/comment",middleware.isLoggedIn,function(req, res) {
   Comment.create(req.body.comment,function (err,comment) {
        if (err) {
            console.log(err);
        } else {
            Post.findById(req.params.id,function(err, post) {
                if (err) {
                    console.log(err);
                } else {
               var author = {id:req.user._id,
                        username:req.user.username
                       };
                        comment.author = author;
                        comment.save();
                        post.comments.push(comment);
                        post.save();
                        res.redirect("/home/"+req.params.id);     
                }
                        
            });
        }
   }); 
});

router.get("/home/:id/comment/:comment_id/edit",middleware.commentAuthorisation,function (req,res) {
   Comment.findById(req.params.comment_id,function(err, comment) {
       if (err) {
           console.log(err);
       } else {
           res.render("editComment",{comment:comment,post_id:req.params.id});
       }
   }) ;
});

router.put("/home/:id/comment/:comment_id",middleware.commentAuthorisation,function (req,res) {
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,updatedComment) {
       if (err) {
           req.flash("error","Something unexpected happen");
           console.log(err);
           res.redirect("back");
       } else {
           req.flash("success","You update a comment");
           res.redirect("/home/"+req.params.id);
       }
   });
});

router.delete("/home/:id/comment/:comment_id",middleware.commentAuthorisation,function (req,res) {
   Comment.findByIdAndRemove(req.params.comment_id,function (err) {
       if (err) {
           req.flash("error","Something unexpected happen");
           console.log(err);
       } else {
           req.flash("success","You dleted a comment");
           res.redirect("/home/"+req.params.id);
       }
   }) ;
});

//Blog comments


router.post("/blogs/:id/comment",middleware.isLoggedIn,function(req, res) {
   Comment.create(req.body.comment,function (err,comment) {
        if (err) {
            console.log(err);
        } else {
            Blog.findById(req.params.id,function(err, blog) {
                if (err) {
                    console.log(err);
                } else {
               var author = {id:req.user._id,
                        username:req.user.username
                       };
                        comment.author = author;
                        comment.save();
                        blog.comments.push(comment);
                        blog.save();
                        res.redirect("/blogs/"+req.params.id);     
                }
                        
            });
        }
   }); 
});

router.get("/blogs/:id/comment/:comment_id/edit",middleware.blogAuthorisation,function (req,res) {
   Comment.findById(req.params.comment_id,function(err, comment) {
       if (err) {
           console.log(err);
       } else {
           res.render("editComment_blog",{comment:comment,post_id:req.params.id});
       }
   }) ;
});

router.put("/blogs/:id/comment/:comment_id",middleware.blogAuthorisation,function (req,res) {
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,updatedComment) {
       if (err) {
           req.flash("error","Something unexpected happen");
           console.log(err);
           res.redirect("back");
       } else {
           req.flash("success","You update a comment");
           res.redirect("/blogs/"+req.params.id);
       }
   });
});

router.delete("/blogs/:id/comment/:comment_id",middleware.blogAuthorisation,function (req,res) {
   Comment.findByIdAndRemove(req.params.comment_id,function (err) {
       if (err) {
           console.log(err);
           req.flash("error","Something unexpected happen");
           res.redirect("back");
       } else {
           req.flash("success","You deleted a comment");
           res.redirect("/blogs/"+req.params.id);
       }
   }) ;
});



module.exports = router;