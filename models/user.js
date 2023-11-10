const userdb = require('../db_connection');

const createUser =(name, username, password, email, age, contact_number, gender)=>{ 
qr = `insert into customer(name, username, password, email, age, contact_number, gender) values(?, ?, ?, ?, ?, ?, ?)`;
userdb.con.query(qr,[name, username, password, email, age, contact_number, gender],(err)=>{
    if(err){
        res.send({error:"error occured"})
    }
    else{
        res.send({success:"success"})
    }
   })
}

const login = (username,password, callback)=>{
    loginQr = `select username, password from customer where username=? and password=?`;
    userdb.con.query(loginQr,[username, password],(err, result)=>{
        if(err){
            callback({error:"error"}, null)
        }
        else{
            callback(null, result);
        }
       })
}        


module.exports = {
    createUser,login
}


