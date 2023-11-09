const mysql = require("mysql2");
const promise = require("mysql-promise");
const con = mysql.createConnection({
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

module.exports= {con}
