var mongoose = require("mongoose"),
    Post     = require("./post");
// var data = [
//             {
//                 code:"c1234",
//                 subject:"C++",
//                 title:"FUNCIONS"
//             },
            
//             {
//                 code:"D456",
//                 subject:"DATA STRUCTURES",
//                 title:"ARRAYS & LINKED LISTS"
//             },
//             {
//                 code:"E8905",
//                 subject:"ENGLISH",
//                 title:"ASSIGNMENT1"
//             }
//     ];
function seed(){
    // // create items to database
    // data.forEach(function (post) {
    //     Post.create(post,function (err,savedPost) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log("POST HAS BEEN ADDED");
    //         }
    //     });
    // });
    Post.remove({},function (err) {
        if(err){
            console.log(err);
            return;
        }
    });
}

module.exports = seed;