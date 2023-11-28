const express = require('express');
const userController = require('../controllers/user');
const multer = require('../middleWare/multer');

const router = express.Router();

router.post('/updateProfile', multer.upload.single('image'), userController.upadteImage);
router.post('/signup', userController.registerUser);
router.post('/login', userController.checkLogin);

module.exports = router;
