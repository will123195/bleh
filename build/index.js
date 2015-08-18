var path = require('path')
var clone = require('clone')
var async = require('async')
var debug = require('debug')('bleh:build')

var handlebars = require('./handlebars')
var browserify = require('./browserify')
var less = require('./less')

module.exports = function (opts) {
  var cwd = process.cwd()

  debug('scan', cwd)

  if (opts.verbose) {
    debug('verbose!')
  }

  async.parallel([
    function (done) {
      handlebars({}, done)
    },
    function (done) {
      browserify({}, done)
    },
    function (done) {
      less({}, done)
    }
  ], function (err) {
    if (err) {
      return console.log('err:', err)
    }
    debug('dist', path.join(cwd, 'public/dist'))
  })
}
