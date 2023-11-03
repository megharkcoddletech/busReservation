const userdb = require('../db_connection');

userdb.con
const createUser =(name, username, password, email, age, contact_number, gender)=>{ 
qr = `insert into customer(name, username, password, email, age, contact_number, gender) values(?, ?, ?, ?, ?, ?, ?)`;
userdb.con.query(qr,[name, username, password, email, age, contact_number, gender],(err,result)=>{
    if(err){
        res.send({error:"error occured"})
    }
    else{
        res.send({success:"success"})
    }
   })
}


module.exports = {
    createUser
}


