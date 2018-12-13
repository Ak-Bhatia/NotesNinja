var express = require("express"),
    router = express.Router(),
    Blog = require("../blog"),
    middleeware = require("../../middleware"),
    expressSanitizer = require("express-sanitizer");
    
router.use(expressSanitizer());

router.get("/", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index_blog", {blogs: blogs}); 
        }
    });
});

router.get("/new",middleeware.isLoggedIn, function(req, res){
   res.render("new_blog"); 
});

router.post("/", middleeware.isLoggedIn,function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   var formData = req.body.blog;
   var author = {
       id:req.user._id,
       username:req.user.username
   };
   formData.author = author;
   Blog.create(formData, function(err, newBlog){
      if(err){
          res.render("new_blog");
      } else {
          res.redirect("/blogs");
      }
   });
});


router.get("/:id",middleeware.isLoggedIn ,function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function (err,resultBlog) {
        if (err) {
           console.log(err);
       }else{
           res.render("show_blog",{resultBlog:resultBlog});
       }
    });
});


router.get("/:id/edit", middleeware.blogAuthorisation,function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else {
           res.render("edit_blog", {blog: blog});
       }
   });
});

router.put("/:id",middleeware.blogAuthorisation, function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/blogs/" + blog._id;
         res.redirect(showUrl);
       }
   });
});

router.delete("/:id",middleeware.blogAuthorisation,function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
       } else {
           blog.remove();
           res.redirect("/blogs");
       }
   }); 
});



module.exports = router;