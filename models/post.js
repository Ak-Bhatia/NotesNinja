var mongoose = require("mongoose"),
    User = require("./user");

var postSchema = new mongoose.Schema({
    code:String,
    subject:String,
    pages:Number,
    fileName:String,
    images:Array,
    publicId:String,
    title:String,
    size:Number,
    url:String,
    created:  {type: Date, default: Date.now},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            rel:User
        },
        username:String
    },
    comments:[
            {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"comment"
                }
        ],
    payments:[{
        price:Number,
        shopkeeper:{
            name:String,
            paytm:Number,
            shopkeeperId:String,
            address:String
        }
    }]
});

module.exports = mongoose.model("post",postSchema);