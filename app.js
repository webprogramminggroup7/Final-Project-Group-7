const express = require('express');
const morgan = require('morgan');
const hpp = require("hpp")
const tourRoutes = require("./routes/tourRoutes")
const userRoutes = require("./routes/userRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

module.exports = app