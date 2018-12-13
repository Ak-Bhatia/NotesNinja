var mongoose=require("mongoose");

var orderSchema = new mongoose.Schema({
    status:{type:Boolean,default:false},
    message:String,
    paymentId:String,
    copies:Number,
    username:String,
    code:String
});

module.exports = mongoose.model("order",orderSchema);