var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin:{type:Boolean, default:false},
    isShopkeeper:{type:Boolean,default:false},
    name:String,
    address:String,
    paytm:Number,
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order'
        }]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);