var express = require("express"),
    Post = require("../post"),
    User = require("../user"),
    middleware = require("../../middleware"),
    router = express.Router();
    
// var infoPending = [];
// var infoDone = [];
            
router.get('/',middleware.isShopkeeper,function (req,res) {
    if (!req.user.address) {                     //we will input each detail together so just checking 1
        res.render('shopkeeper_details');
    } 
    var noMatch = null;
    if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
     Post.find({code: regex},function (err,posts) {
        if (err) {
            console.log(err);
            req.flash('error',err.message);
            return res.redirect('back');
        } else {
             if(posts.length < 1){
                   noMatch = "No match found.Try again";
               }
            var infoPending = [];
            var infoDone = [];
            sortingPosts(infoPending,infoDone,posts,req.user);
            res.render('shopkeeper_home',{infoPending:infoPending,infoDone:infoDone,noMatch:noMatch});
        }
    });
    }else {
        Post.find({},function (err,posts) {
        if (err) {
            console.log(err);
            req.flash('error',err.message);
            return res.redirect('back');
        } else {
            var infoPending = [];
            var infoDone = [];
            sortingPosts(infoPending,infoDone,posts,req.user);
            res.render('shopkeeper_home',{infoPending:infoPending,infoDone:infoDone,noMatch:noMatch});
        }
    });
    }
});

router.get("/:post_id",middleware.isShopkeeper,function (req,res) {
    Post.findById(req.params.post_id,function(err, post) {
        if (err) {
            console.log(err);
            return req.flash("error","Something unexpected happened");
        } else {
            res.render("show_shopkeeper",{post:post});
        }
    });
});

router.post('/:post_id',middleware.isShopkeeper,function (req,res) {
    Post.findById(req.params.post_id,function (err,post) {
        if (err) {
            console.log(err);
            req.flash('error','Something unexpected happened');
            return res.redirect('back');
        } else {
            var payment = {
            price:req.body.price,
            shopkeeper:{
                name:req.user.name,
                paytm:req.user.paytm,
                shopkeeperId:req.user._id,
                address:req.user.address
            }
        };
        post.payments.push(payment);
        post.save();
        }
        res.redirect("/shopkeeper");
    });
});

router.get("/:post_id/edit",middleware.isShopkeeper,function(req, res) {
    Post.findById(req.params.post_id,function(err, post) {
        post.payments.forEach(function (payment) {
            if(payment.shopkeeper.shopkeeperId == req.user._id){
                res.render("edit_shopkeeper",{post:post,price:payment.price});
            }
        });
    });
});

router.post('/:post_id/edit',middleware.isShopkeeper,function (req,res) {
    Post.findById(req.params.post_id,function (err,post) {
        if (err) {
            console.log(err);
            req.flash('error','Something unexpected happened');
            return res.redirect('back');
        } else {
            post.payments.forEach(function (payment) {
                if(payment.shopkeeper.shopkeeperId == req.user._id){
                    payment.price = req.body.price;
                    post.save();
                    res.redirect("/shopkeeper");
            }
            });
        
        }
    });
});

router.post('/:id/details',middleware.isShopkeeper,function(req, res) {
    User.findById(req.params.id,function (err,user) {
        if (err) {
            console.log(err);
            req.flash('error',err.message);
            return res.redirect('back');
        } else {
        user.name = req.body.name;
        user.address = req.body.address;
        user.paytm = req.body.paytm;
        user.save();
        }
        res.redirect('/shopkeeper');
    });
});




function sortingPosts(arr1,arr2,posts,currentUser) {
    posts.forEach(function(post){
        if(post.payments.length<1){
            arr1.push(post);
        }else{
            var num = 0;
            post.payments.forEach(function(payment){
                if(payment.shopkeeper.shopkeeperId == currentUser._id){
                    arr2.push(post);
                    num = num+1;
                }
            });
            if(num == 0){
            arr1.push(post);
            }
        }
    });
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;