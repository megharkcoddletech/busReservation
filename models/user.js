const userdb = require('../db_connection');

async function createUser(name, username, password, email, age, contactNumber, gender) {
  const db = userdb.makeDb(userdb);
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
  const db = userdb.makeDb(userdb);
  try {
    const loginQr = 'select username, password from customer where username=? and password=?';
    const userLogin = await db.query(loginQr, [username, password]);
    return userLogin;
  } catch (err) {
    await db.close();
    throw err;
  }
}

async function userImage(name, userName, contactNumber, image, id) {
  const db = userdb.makeDb(userdb);
  try {
    const addImage = 'update customer set name = ?, username = ?, contact_number = ?, image = ?  where id = ?';
    const profileImage = await db.query(
      addImage,
      [name, userName, contactNumber, image.originalname, id],
    );
    return profileImage;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

module.exports = {
  createUser, login, userImage,
};
