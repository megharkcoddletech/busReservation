const jwt = require('jsonwebtoken');
const adminDb = require('../model/authentication');

const checkLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const checkLoginQuery = await adminDb.login(username, password);
    const { body } = req;

    if (checkLoginQuery.length > 0) {
      if (checkLoginQuery[0].username === body.username
        && checkLoginQuery[0].password === body.password) {
        const { id } = checkLoginQuery[0];
        const token = jwt.sign({ id }, 'userkey', { expiresIn: 3000 });
        res.status(200).json({ success: 'true', token, message: 'login successfull' });
      } else {
        res.status(400).json({ success: false, message: 'enter valid input and output' });
      }
    }
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

module.exports = {
  checkLogin,
};
