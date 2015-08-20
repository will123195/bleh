var express = require('express')
var bleh = require('..')

var app = express()
var routes = bleh()

app.set('port', (process.env.PORT || 5000))
app.use('/', routes)

module.exports = app
