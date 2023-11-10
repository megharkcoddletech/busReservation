const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(express.json());
const userRoute = require('./routes/user');
app.use('/user',userRoute);

const busRoute = require('./routes/bus');
app.use('/bus',busRoute);

const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(3001);