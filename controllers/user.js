const userDb = require("../models/user")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    console.log(res);
    const { name, username, password, email, age, contact_number, gender } = req.body;
    const signUp = await userDb.createUser(name, username, password, email, age, contact_number, gender);
    if (name == null || password == null || username == null || email == null || age == null || contact_number == null || gender == null) {
        res.status(400).json({ success: "false", message: "Fill the empty fields" });
    }
    else {
        res.status(200).json({ success: "true", message: signUp[0] });
    }
}

const checkLogin = async (req, res) => {
    const { username, password } = req.body;
    const checkLoginQuery = await userDb.login(username, password);
    const body = req.body;
    if (checkLoginQuery.length > 0) {
        if (checkLoginQuery[0][0].username == body.username && checkLoginQuery[0][0].password == body.password) {
            const id = checkLoginQuery[0][0].id;
            const token = jwt.sign({ id }, "userkey", { expiresIn: 300 });
            res.status(200).json({ success: "true", token, message: "login successfull", })
        }
        else {
            res.status(400).json({ success: false, message: "enter valid input and output" })
        }
    }
}

module.exports = {
    registerUser,
    checkLogin
}

