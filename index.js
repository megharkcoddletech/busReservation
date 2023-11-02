const bodyParser = require("body-parser");
var express = require("express");
var app = express();
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

var cors = require("cors");
app.use(cors());

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({extended:false});

app.post("/signup",jsonParser, function(req, res){
   let name = req.body.name;
   let username = req.body.username;
   let password = req.body.password;
   let email = req.body.email;
   let age = req.body.age;
   let contact_number = req.body.contact_number;
   let gender = req.body.gender;
   var bodyParser = require("body-parser");
    
   let qr = `insert into customer(name, username, password, email, age, contact_number, gender) values('${name}', '${username}', '${password}', '${email}', '${age}', '${contact_number}', '${gender}')`;
   con.query(qr,(err,result)=>{
    if(err){
        res.send({error:"error occured"})
    }
    else{
        res.send({success:"success"})
    }
   })
})


app.listen(5000, function(){
    console.log("server started");
})

