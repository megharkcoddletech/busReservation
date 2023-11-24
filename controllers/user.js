const jwt = require('jsonwebtoken');
const userDb = require('../models/user');

const registerUser = async (req, res) => {
  try {
    const {
      name, username, password, email, age, contactNumber, gender,
    } = req.body;
    const signUp = await userDb.createUser(
      name,
      username,
      password,
      email,
      age,
      contactNumber,
      gender,
    );
    if (signUp.length > 0) {
      res.status(404).json({ success: 'false', message: 'user already exists' });
    }
    if (name === undefined || password === undefined || username === undefined
        || email === undefined || age === undefined || contactNumber === undefined
        || gender === undefined) {
      res.status(400).json({ success: 'false', message: 'Fill the empty fields' });
    } else {
      res.status(200).json({ success: 'true', message: 'user registered successfully' });
    }
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server' });
  }
};

const checkLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const checkLoginQuery = await userDb.login(username, password);
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

const upadteImage = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: 'false', message: 'invalid image' });
    }
    const {
      name, userName, contactNumber, id,
    } = req.body;
    const image = req.file;
    const url = `http://localhost:3001/uploads/${req.file.filename}`;
    const addImage = await userDb.userImage(name, userName, contactNumber, image, id);
    if (addImage) {
      res.status(200).json({ success: 'true', message: addImage, url });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

module.exports = {
  registerUser,
  checkLogin,
  upadteImage,
};
