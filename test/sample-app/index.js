var express = require('express')
var bleh = require('bleh')
var app = express()

app.set('port', (process.env.PORT || 5000))

app.use('/', bleh())

app.listen(app.get('port'), function () {
  console.log([
    'My Bleh App',
    'Running: http://localhost:' + app.get('port'),
    'process.env.NODE_ENV: ' + process.env.NODE_ENV,
  ].join('\n'))
})