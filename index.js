'use strict';

require('dotenv').config();

console.log(typeof process.env.MONGODB_URI);

// Turn us into ES6!!
require('babel-register');

// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI, options);

// Start the web server
require('./src/app.js').start(process.env.PORT);