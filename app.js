const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const User = require('./models/user');


if (!process.env.MONGODB_URL) require('dotenv').config();   // loading .env file

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// serve everything else statically
app.use(express.static(path.join('public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req,res,next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


// app.use((req, res, next) => {
//   const error = new HttpError('Could not find this route.', 404);
//   throw error;
// });

// in case of something went wrong, and a file had been sent to the server, remove the pending file.
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});



mongoose
.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => {
  // console.log("Server is up at port", process.env.PORT || 5000, ". MongoDB is ", process.env.MONGODB_URL + '&retryWrites=false')
  console.log("Server is up at port", process.env.PORT || 5000, ". MongoDB is ", process.env.MONGODB_URL)
  app.listen(process.env.PORT || 5000);

})
.catch(err => {
  console.log("Error __",err);
});
