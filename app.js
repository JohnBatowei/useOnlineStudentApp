var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
let session = require('express-session')
let mongoDbSession = require('connect-mongodb-session')(session)
var expressLayout = require("express-ejs-layouts");
require('dotenv').config()


var indexRouter = require('./routes/index');
let adminRouter = require('./routes/apiAdmin')
let staffRouter = require('./routes/apiStaff')
let studentRouter = require('./routes/apiStudent')


var app = express();

const store = new mongoDbSession({
  uri : process.env.loginSession,
  collection: 'loginsGVU'
})

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  // cookie: {maxAge: 180*60*1000}
}))

// view engine setup
app.use(expressLayout)
app.set('layout','./layouts/homeLayout')
// for every page make use of this homeLayout
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/')));

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('error', { error: err });
});

app.use('/', indexRouter);
app.use('/api/admin', adminRouter);
app.use('/api/staff', staffRouter);
app.use('/api/student', studentRouter);

app.post('/logout',async function(req,res){
  req.session.destroy((err)=>{
    if(err)console.log(err)
    res.clearCookie('token')
    res.clearCookie('connect.sid')
    res.redirect('/')
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// connecting to mongodb
const connect = require('./config/config')

async function connectDB(conn){
  const connected = await conn
  if(connected){
    return console.log('Connected to DBs and listening to Port 5200');
  }
  console.log('Unable to connect to DB');
}
connectDB(connect)



module.exports = app;