const userdb = require('../db_connection');
const db = userdb.makeDb(userdb)
const createUser = async (name, username, password, email, age, contact_number, gender) => {

    try{
        const qr = `insert into customer (name, username, password, email, age, contact_number, gender) values(?, ?, ?, ?, ?, ?, ?)`;
        const addUser = await db.query(qr, [name, username, password, email, age, contact_number, gender]);
        return addUser;
    }
    catch(err){
        await db.close();
    }
}

const login = async (username, password) => {

   try {
     const loginQr = `select username, password from customer where username=? and password=?`;
     const userLogin = await db.query(loginQr, [username, password]);
     return userLogin;
   }
   catch(err){
    await db.close();
   }
}

module.exports = {
    createUser, login
}


