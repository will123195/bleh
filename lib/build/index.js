var path = require('path')
var async = require('async')
var merge = require('deepmerge')
var chalk = require('chalk')
var debug = require('debug')('bleh:build')
var fs = require('fs')

var browserify = require('./browserify')
var less = require('./less')
var express = require('./express')
var handlebars = require('./handlebars')

// get the main path where ./node_modules/bleh is located (require)
var reqMainPath = function (opts) {
  var main
  require.main.paths.some(function (p) {
    main = p
    return fs.existsSync(path.join(p, 'bleh'))
  })
  return path.resolve(main, '..')
}
// get the main path where ./node_modules/bleh is located (cli)
var fsMainPath = function (opts) {
  var paths = []
  var main = opts.root
  var depth = main.split(path.sep).length
  for (var i = 0; i < depth; i++) {
    paths.push(main)
    var checkPath = path.join(main, 'node_modules', 'bleh')
    if (fs.existsSync(checkPath)) {
      break;
    }
    main = path.resolve(main, '..')
  }
  return main
}

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
  var main = options.main
  if (!main) {
    if (options.cli) {
      main = fsMainPath({
        root: root
      })
    } else {
      main = reqMainPath()
    }
  }

  if (!options.main) {
    delete options.main
  }

  var opts = merge({
    root: root,
    main: main
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
      console.log(chalk.red('bleh:build error'), err)
      cb(err)
      return
    }
    debug('dist', path.join(opts.root, 'public', 'dist'))
    var elapsed = Date.now() - start
    console.log(chalk.cyan('bleh:build', 'complete', elapsed + 'ms'))
    cb(null)
  })
}
