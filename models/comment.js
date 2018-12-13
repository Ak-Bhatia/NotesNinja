var mongoose = require("mongoose"),
    User     = require("./user");

var CommentSchema = new mongoose.Schema({
    text:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            rel:"User"
            },
        username:String
    }
});
module.exports = mongoose.model("comment",CommentSchema);
