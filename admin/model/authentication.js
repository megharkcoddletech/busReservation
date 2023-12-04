const adminDb = require('../../db_connection');

async function login(username, password) {
  const db = adminDb.makeDb(adminDb);
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
  login,
};
