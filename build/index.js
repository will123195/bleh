var path = require('path')
var clone = require('clone')
var async = require('async')
var xtend = require('xtend')
var chalk = require('chalk')
var debug = require('debug')('bleh:build')

var browserify = require('./browserify')
var less = require('./less')
var express = require('./express')
var handlebars = require('./handlebars')

// opts.verbose
// opts.root
// opts.cli
module.exports = function (options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  options = options || {}
  cb = cb || function () {}

  var start = Date.now()

  var root = options.root || process.cwd()

  var opts = xtend({
    root: root
  }, options)

  debug('scan', opts.root)

  if (opts.verbose) {
    debug('verbose!')
  }

  async.auto({
    browserify: ['handlebars', function (done) {
      browserify(opts, done)
    }],
    less: function (done) {
      less(opts, done)
    },
    express: function (done) {
      express(opts, done)
    },
    handlebars: function (done) {
      handlebars(opts, done)
    }
  }, function (err) {
    if (err) {
      console.log('bleh build error:', err)
      cb(err)
      return
    }
    debug('dist', path.join(opts.root, 'public', 'dist'))
    var elapsed = Date.now() - start
    console.log(chalk.cyan('bleh:build', 'complete', elapsed + 'ms'))
    cb(null)
  })
}
