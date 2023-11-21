const userdb = require('../db_connection');

const db = userdb.makeDb(userdb);

async function createUser(name, username, password, email, age, contactNumber, gender) {
  try {
    const users = 'select * from customer where email = ?';
    const checkUser = await db.query(users, [email]);
    let result;
    if (checkUser.length > 0) {
      result = checkUser;
    } else {
      const qr = 'insert into customer (name, username, password, email, age, contact_number, gender) values(?, ?, ?, ?, ?, ?, ?)';
      const addUser = await db.query(
        qr,
        [name, username, password, email, age, contactNumber, gender],
      );
      result = addUser;
    }
    return result;
  } catch (err) {
    await db.close();
    throw err;
  }
}

async function login(username, password) {
  try {
    const loginQr = 'select username, password from customer where username=? and password=?';
    const userLogin = await db.query(loginQr, [username, password]);
    return userLogin;
  } catch (err) {
    await db.close();
    throw err;
  }
}

module.exports = {
  createUser, login,
};
