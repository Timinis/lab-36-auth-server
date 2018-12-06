'use strict';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

var fs = require('fs');
var https = require('https');


import authRouter from './auth/router.js';
import auth from './auth/middleware.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/404.js';

let app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());  // => req.body
app.use(express.urlencoded({ extended: true })); // req.body => from a form's key value pairs
app.use(cookieParser());

app.use(authRouter);

// app.get('/', (req, res) => {
//   res.send('HTTPS LIVE');
// });

app.get('/', auth(), (req, res) => {
  res.send('You Got In');
});

app.use(notFound);
app.use(errorHandler);

let server = false;

module.exports = {
  start: (port) => {
    if (!server) {
      server = https.createServer({
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.cert'),
      }, app).listen(port, (err) => {
        if (err) { throw err; }
        console.log('CERT', fs.readFileSync('server.cert'));
        console.log('KEY', fs.readFileSync('server.key'));
        console.log('HTTPS: Server running on', port);
      });
    }
    else {
      console.log('Server is already running');
    }
  },

  stop: () => {
    server.close(() => {
      console.log('Server is now off');
    });
  },
};


// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app)
//   .listen(3000, function () {
//     console.log('Example app listening on port 3000! Go to https://localhost:3000/')
//   })





// module.exports = {
//   start: (port) => {
//     if(!server) {
//       server = app.listen(port, (err) => {
//         if(err) { throw err; }
//         console.log('Server running on', port);
//       });
//     }
//     else {
//       console.log('Server is already running');
//     }
//   },

//   stop: () => {
//     server.close( () => {
//       console.log('Server is now off');
//     });
//   },
// };