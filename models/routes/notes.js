var express = require("express"),
    Post = require("../post"),
    middleeware = require("../../middleware"),
    multer = require("multer"),
    bodyParser = require("body-parser"),
    router = express.Router();
    
var fileName;
router.use(bodyParser.urlencoded({extended: true}));    
            //multer storage
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
      fileName = Date.now() + file.originalname;
    callback(null,fileName );
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(pdf)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'bharatnischal', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Post.find({code: regex}, function(err, posts){
           if(err){
               console.log(err);
           } else {
               if(posts.length < 1){
                   noMatch = "No match found.Try again";
               }
              res.render("index",{posts:posts,noMatch:noMatch});
           }
        });
    }else {
    Post.find({},function (err,posts) {
        if (err) {
            console.log(err);
        } else {
        var date = new Date();
        var temp = true ;
        var tempDate = date;
        var checkDate =function(created){
            if(tempDate === created){
                temp = false;
            }else{
                temp = true;
                tempDate = created;
            }
        };
            res.render("index",{posts:posts,noMatch:noMatch,checkDate:checkDate,date:date,temp:temp});
        }
    });
    }
    
});

router.get("/new",middleeware.isAdimin, function(req, res){
   res.render("new",{posts:undefined}); 
});

router.post("/",middleeware.isAdimin,upload.single('pdf'), function(req, res){
    Post.find({code:req.body.post.code},function(err,posts) {
        if(posts.length>0){
            console.log(req.body.post);
            res.render('new',{posts:req.body.post,error:'Code already exists'});
        }else{
            cloudinary.uploader.upload(req.file.path, function(result) {
                        var i=1;
                        var temp;
                        var createdPost = req.body.post;
                        createdPost.fileName = fileName;
                        createdPost.size = (req.file.size/1048576).toFixed(2);  // conversion to mb
                        createdPost.url = result.secure_url;
                        createdPost.publicId = result.public_id;
                        createdPost.pages = result.pages;
                        if(result.pages>=5){
                            temp = 5;
                        }else{
                            temp = result.pages;
                        }
                            createdPost.images = [];
                            for(i=1;i<=temp;i++){
                                var length = result.secure_url.length;
                                var index = result.secure_url.indexOf("upload");
                                var url = result.secure_url.slice(0,index) +"upload/w_560,h_700,c_fill,pg_" + i + result.secure_url.slice(index+6,length-4) + ".png";
                                createdPost.images.push(url);
                            }
                        
                        createdPost.author = {
                        id:req.user._id,
                        username:req.user.username
                        };
                        Post.create(createdPost,function (err,savedPost) {
                            if (err) {
                                console.log(err);
                                res.redirect("/home");
                            }else{
                                console.log("file uploaded successfully");
                                res.redirect("/home");
                            }
                        });
                    
            });

        }
    });
});
router.get("/:id",middleeware.isLoggedIn ,function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function (err,resultPost) {
        if (err) {
           console.log(err);
       }else{
           res.render("show",{resultPost:resultPost});
       }
    });
});

router.delete('/:id',middleeware.postAuthorisation,function (req,res) {
    Post.findById(req.params.id,function (err,post) {
        if(err){
            console.log(err);
            req.flash('error','Something unexpected happened');
            return res.redirect('back');
        }else{
            cloudinary.v2.uploader.destroy(post.publicId);
            post.remove();
            req.flash('success','Post removed successfully');
            res.redirect('/home');
        }
    });
});

// downloading route
router.get("/:id/download",function (req,res) {
    Post.findById(req.params.id,function (err,post) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            console.log(post);
            
            res.redirect(post.url);   
        }
    });
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;