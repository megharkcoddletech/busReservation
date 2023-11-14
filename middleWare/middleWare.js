const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
    let authHeader = req.headers.authorization;
    if (authHeader == undefined) {
        res.status(404).json({ error: "no token provided" });
    }
    let token = authHeader.split(" ")[1];
    jwt.verify(token, "userkey", (req,res)=> {
        try{
            next();
        }
        catch(err){
            res.status(500).json({ success: false, message: "internal server error" });
        }
        
    })
}

module.exports = {
    verifyToken
}