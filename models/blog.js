var mongoose = require("mongoose"),
    User = require("./user");

var blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String,
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
        ]
});

module.exports = mongoose.model("Blog", blogSchema);
