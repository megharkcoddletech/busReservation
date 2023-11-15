const userDb = require("../models/user")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {

    try {
        const { name, username, password, email, age, contact_number, gender } = req.body;
        const signUp = await userDb.createUser(name, username, password, email, age, contact_number, gender);
        if(signUp.length>0){
            res.status(404).json({success: "false", message:"user already exists"})
        }
        if (  name === undefined || password === undefined || username === undefined || email === undefined || age === undefined || contact_number === undefined || gender === undefined) {
            res.status(400).json({ success: "false", message: "Fill the empty fields" });
        }
        else {
            res.status(200).json({ success: "true", message: "user registered successfully", });
        }
    }
    catch(err){
        res.status(500).json({success: "false", message:"internal server "})
    }
}

const checkLogin = async (req, res) => {
   try {
     const { username, password } = req.body;
     const checkLoginQuery = await userDb.login(username, password);
     const body = req.body;     

     if (checkLoginQuery.length > 0) {
        
         if (checkLoginQuery[0].username === body.username && checkLoginQuery[0].password === body.password) {
             const id = checkLoginQuery[0].id;
             const token = jwt.sign({ id }, "userkey", { expiresIn: 3000 });
             res.status(200).json({ success: "true", token, message: "login successfull", });
         }
         else {
             res.status(400).json({ success: false, message: "enter valid input and output" });
         }
     }
   }
   catch(err){
    res.status(500).json({success:"false", message: "internal server error"});
   }
}

module.exports = {
    registerUser,
    checkLogin
}

