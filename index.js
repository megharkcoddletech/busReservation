const bodyParser = require('body-parser');

const express = require('express');

const app = express();

app.use(express.json());
const cors = require('cors');

const userRoute = require('./routes/user');

app.use('/user', userRoute);
app.use('/uploads', express.static('uploads'));

const busRoute = require('./routes/bus');

app.use('/bus', busRoute);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3001);
