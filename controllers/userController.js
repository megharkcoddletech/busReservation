const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

const registerUser = (req, res) =>{
    const {name, username, password,email, age, contact_number,gender} = req.body;
    if(!name || !password || !username || !email || !age || !contact_number || gender){
        console.log("Fill the empty field");
        res.status(400).json({ error: "Fill the empty fields" });  
    }
    else{
        console.log(name);
    }
} 

const checkLogin = (req, res) =>{
    const {username, password} = req.body;
    userModel.login(username, password, (err, result) =>{
        if (err){
            res.status(500).json({success:false, error: "intenal server error" });
        } else if(result.length === 1 && result[0].username === username && result[0].password === password) {
            const id = result[0].id;
            const token = jwt.sign({id}, "userkey",{expiresIn: 300});
            res.status(200).json({success:true, token, message : "login succesfull"});
            }
        else{
            res.status(400).json({success:false, message:"enter valid input and output"})
            }
        });

    }
    
module.exports={registerUser,checkLogin} 

   