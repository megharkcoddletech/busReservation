const userModel = require("../models/userModel")

const registerUser = (req, res) =>{
    const {name, username, password,email, age, contact_number,gender,} = req.body;
    if(!name || !password || !username || !email || !age || !contact_number){
        console.log("Fill the empty field");
        res.status(400).json({ error: "Fill the empty fields" });   
     
    }
} 

module.exports={registerUser}
   