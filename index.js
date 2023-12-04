const bodyParser = require('body-parser');

const express = require('express');

const app = express();

app.use(express.json());
const cors = require('cors');

app.use(cors());

const userRoute = require('./routes/user');
const admin = require('./admin/route/admin');
const adminAuthentication = require('./admin/route/authentication');

app.use('/adminAuth', adminAuthentication);
app.use('/admin', admin);

const user = require('./user/route/user');
const userAuthentication = require('./user/route/authentication');

app.use('/user', user);
app.use('/userAuth', userAuthentication);

app.use('/user', userRoute);
app.use('/uploads', express.static('uploads'));

const busRoute = require('./routes/bus');

app.use('/bus', busRoute);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3001);
