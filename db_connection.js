// var mysql = require('mysql2');
// var con = mysql.createConnection({
//     host:"localhost",
//     user: "root",
//     password : "S006ya#1",
//     database: "megha",
//     port : 3000,
// });
// con.connect(function(err){
//     if(err) { 
//     console.log("connected");
//     }
// })

var mysql = require("mysql2");
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "S006ya#1",
    database: "megha"
});
con.connect(function(err){
    if(err) { 
    console.log("error");
    }
    else{
        console.log("connected");
    }
});