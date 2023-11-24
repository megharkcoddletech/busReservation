const express = require('express');

const multer = require('multer');

const path = require('path');

const userController = require('../controllers/user');

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './uploads');
  },
  filename(req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

const router = express.Router();

router.post('/upadateProfile', upload.single('image'), userController.upadteImage);
router.post('/signup', userController.registerUser);
router.post('/login', userController.checkLogin);

module.exports = router;
