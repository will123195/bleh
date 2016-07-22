var express = require('express')
var bleh = require('bleh')

var app = express()

app.use(bleh({
  home: '/home'
}))

module.exports = app
