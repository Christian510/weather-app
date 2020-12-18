require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoSessionClient = require('./util/sessiondb').mongoSessionClient;

const app = express();

// Routers
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
// Sass Compiler

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const sessionStore = new MongoStore({
  url: 'mongodb+srv://Christian:ewv7KxfQ@weatherappdb.cq3qr.mongodb.net/WeatherAppDB?retryWrites=true&w=majority',
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
});

app.use(session({
  secret: 'secret-key',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // EQUALS 1 DAY ( 1 DAY * 24 HR/1 DAY * 60 MIN/1 HR)
  },
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
}));

app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
