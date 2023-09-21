var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csb = require('./config-service-binding');

var mongodb = require('./db');

var routes = require('./routes/routes');

var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
  app.locals.pretty = true;
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  console.log("ERROR =>" + err.message)

});


const all = csb.all_bindings()
console.log(all)
console.log("->>>load app Configuration -----------------------------------------------")
const appBindings = csb.bindings("config")
//load the applications bindings as environment variables
console.log(appBindings)
Object.entries(appBindings).forEach(([k, v]) => { process.env[k] = v })
console.log("<<<-load app Configuration -----------------------------------------------")

mongodb.connectDB();

module.exports = app;
