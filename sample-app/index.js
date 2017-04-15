var express = require('express')
var bleh = require('..')
var app = express()

app.use(bleh({
  main: __dirname, // needed for tests
  //handlebarsHelpers: 'lib/handlebars-helpers.js',
  sessions: {
    secret: 'some unique random key with plenty of entropy'
  }
}))

app.set('port', (process.env.PORT || 5000))

// error handler
app.use(function (err, req, res, next) {
  var statusCode = err.statusCode || 500
  res.status(statusCode).send(err)
})

module.exports = app
