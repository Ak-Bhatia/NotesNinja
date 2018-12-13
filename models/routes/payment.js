var express = require("express"),
    router = express.Router(),
    Order = require("../orders"),
    User = require("../user"),
    paypal = require('paypal-rest-sdk');
    
var price;
    
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AYTCcSHb9DI8oFLbvGgP-cPzIa4HA18lKISpB6Bg-C5RzQxYFfpcP_VDBX0ND7adq9ZGtT86GEDTMA4u',
  'client_secret': 'EJj6EZ4Y72C9k4P4SmPoYevxktHPpw5DVKPb4lQoxlxkbXuqraCRYgEgPGYNhq6nIj-UfYj998rLgTdt'
});

router.post('/pay/:shop_id',function (req,res) {
    var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "https://murmuring-fortress-50576.herokuapp.com/success",
        "cancel_url": "https://murmuring-fortress-50576.herokuapp.com/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": 'code',
                "sku": "item",
                "price":req.body.price,
                "currency": "USD",
                "quantity": req.body.copies
            }]
        },
        "amount": {
            "currency": "USD",
            "total":    req.body.price * req.body.copies
        },
        "description":  req.params.shop_id   + "&&" +req.body.code 
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        payment.links.forEach(function (link) {
            if(link.rel === 'approval_url'){
                res.redirect(link.href);
            }
        });
    }
});
price=Number(req.body.price) * Number(req.body.copies);
});

router.get('/success',function (req,res) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
            "currency": "USD",
            "total": price
            }
        }]
    };
    
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(payment);
            var description = payment.transactions[0].description;
            var index = description.indexOf("&&");
            var shop = description.slice(0,index);
            var code = description.slice(index+2);
            Order.create({  paymentId:payment.id,
                            message:(Math.random()*9999).toFixed(0),
                            code:code,
                            username:req.user.username,
                            copies:payment.transactions[0].item_list.items[0].quantity
                        },function (err,order) {
                             User.findById(req.user._id,function (err,user) {
                                user.orders.push(order);
                                user.save();
                            });
                            User.findById(shop,function (err,shop) {
                                shop.orders.push(order);
                                shop.save();
                            });
                            
            });
            req.flash("success","Order was placed successfully.See the orders page to check when notes are ready.");
            res.redirect("/home");
        }
    });
});

router.get("/cancel",function(req, res) {
    req.flash("error","Order cancelled");
    res.redirect("/home");
});

module.exports = router;