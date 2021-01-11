require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const port = require('./bin/www').port;
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
// const helmet = require("helmet");
const db = require('./util/database');
const app = express();
// Routers
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const errorController = require('./controllers/errors');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const options = {
  // host: 'localhost',
  // port: 3000,
  // user: 'root',
  // password: 'C2546$6689t',
  // database: 'weather-app',
  clearExpired: true,
  checkExpirationInterval: 1000 * 60 * 60 * 24,
  // checkExpirationInterval: 1000 * 60 * 60 * 24 * 90,
  createDatabaseTable: true,
};
// var connection = mysql.createConnection(options);
const sessionStore = new MySQLStore(options, db);

app.use(session({
  key: 'session_cookie_name',
  secret: 'Conradicus_maximus',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));
// app.use(helmet.contentSecurityPolicy({
//   directives:{
//     defaultSrc:["'self'"],
//     scriptSrc:["'self'",'code.jquery.com','maxcdn.bootstrapcdn.com','cdn.jsdelivr.net'],
//     styleSrc:["'self'",'maxcdn.bootstrapcdn.com'],
//     fontSrc:["'self'",'kit.fontawesome.com']}}));

app.use((req, res, next) => {
  console.log(req.session);
  // if (req.session.viewCount) {
  //   req.session.viewCount++
  // } else {
  //   req.session.viewCount = 1;
  // }
  next();
})

db.execute('SELECT * FROM Cities;')
  .then(result => {console.log(result)})
  .catch(err => {console.log("error msg: ",err)});

db.execute('SELECT * FROM `weather-app`.sessions;')
  .then(result => {console.log(result)})
  .catch(err => {console.log(err)});

app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

// ERROR HANDLING
app.get('/500', errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  res.redirect('/500');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // console.log("error handler: ", res.locals.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
