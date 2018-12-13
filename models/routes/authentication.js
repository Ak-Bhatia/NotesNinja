var express = require("express"),
    passport = require("passport"),
    User = require("../user"),
    Order = require("../orders"),
    middleware = require("../../middleware"),
    router = express.Router();
var async = require("async");
var crypto = require("crypto");
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


router.get("/", function(req, res){
    res.render("landing");
});

router.get("/orders/:profileId",middleware.isLoggedIn,function(req, res) {
    User.findById(req.params.profileId).populate("orders").exec(function (err,user) {
      if (err) {
        console.log(err);
        return req.flash("error","Something unexpected happened");
      } else {
        if (req.user.isShopkeeper) {
          res.render("shopkeeper_order",{user:user})
        } else {
          res.render("order",{user:user});
        }
      }
    });
});
router.delete("/orders/:orderId",function (req,res) {
  Order.findByIdAndRemove(req.params.orderId,function (err) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      req.flash("success","Your order has been completed.");
      res.redirect("back");
    }
  });
});
router.put("/orders/edit/:orderId",function (req,res) {
  Order.findById(req.params.orderId,function (err,order) {
    if (err) {
      console.log(err);
    } else {
      order.status = true;
      order.save();
      res.redirect("back");
    }
  });
});

router.get("/papers",function(req, res) {
    res.render("previousPaper");
});
//AUTHENTICATION ROUTES

router.get("/register",function(req, res) {
    res.render("register",{currentUser:req.user});
});

router.post("/register",function(req, res) {
    var newUser = new User({username:req.body.username,
                            email:req.body.email
    });
    User.register(newUser,req.body.password,function (err,user) {
        if (err) {
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("back");
        } 
        
            passport.authenticate("local")(req,res,function () {
                req.flash("success","Sign up successfully");
                res.redirect("/home");
            });
    });
});
router.get("/login",function(req, res) {
  res.render("login",{currentUser:req.user}); 
});


router.post("/login",passport.authenticate("local",{
    failureRedirect:"/"
}) ,function(req, res) {
    req.flash('success','Logged in successfully');
    if (req.user.isShopkeeper) {
      res.redirect('/shopkeeper');
    } else {
      res.redirect("/home");
    }
});

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var msg = {
            to: user.email,
            from: 'nischalbharat4819@gmail.com',
            subject: 'Printing_aid Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
};
      sgMail.send(msg, function(err) {
        console.log('mail sent');
        req.flash('success', "An e-mail has been sent to " + user.email + " with further instructions.Please check in spam in case you don't see it.");
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var msg = {
            to: user.email,
            from: 'NoReply@printing_aid.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
      sgMail.send(msg, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/home');
  });
});

router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Logout successfully");
    res.redirect("/");
});

module.exports = router;