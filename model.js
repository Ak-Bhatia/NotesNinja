var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo_4");

var shopkeeperSchema = new mongoose.Schema({
    name:String,
    username:String,
    paytm:Number
});

var Shopkeeper = mongoose.model('Shopkeeper',shopkeeperSchema);

var postSchema = new mongoose.Schema({
    title :String,
    url:String,
    purchase:[{
        price:Number,
        shopkeeper:{
            name:String,
            username:String,
            paytm:Number,
            shopkeeperId:String
        }
    }]
});

var Post = mongoose.model('post',postSchema);

// Post.create({
//     title:'Testing model',
//     url:'ascfs'
// },function (err,result) {
//     console.log(result);
// });
// Post.create({
//     title:'Testing model2',
//     url:'ascfsewxcvbn'
// },function (err,result) {
//     console.log(result);
// });
// Post.create({
//     title:'Testing model3',
//     url:'ascfsezxcfvjxcfv'
// },function (err,result) {
//     console.log(result);
// });

// Shopkeeper.create({
//     name:'barat',
//     username:'bassf',
//     paytm:1323637
// },function (err,save) {
//     console.log(save)
// });

Post.findOne({title:'Testing model'},function (err,post) {
    Shopkeeper.findOne({name:'barat'},function (err,shop) {
        console.log(post);
        console.log(shop);
        var purchase = {
            price:250,
            shopkeeper:{
                name:shop.name,
                username:shop.username,
                paytm:shop.paytm,
                shopkeeperId:shop._id
            }
        }
        post.purchase.push(purchase);
        post.save();
        console.log(post.purchase[0].shopkeeper);
    });
});