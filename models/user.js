const userdb = require('../db_connection');

const createUser = async (name, username, password, email, age, contact_number, gender) => {
    const qr = `insert into customer (name, username, password, email, age, contact_number, gender) values(?, ?, ?, ?, ?, ?, ?)`;
    const addUser = await userdb.con.promise().query(qr, [name, username, password, email, age, contact_number, gender]);
    return addUser;
}

const login = async (username, password) => {
    loginQr = `select username, password from customer where username=? and password=?`;
    const userLogin = await userdb.con.promise().query(loginQr, [username, password]);
    return userLogin;
}

module.exports = {
    createUser, login
}


