var express = require('express')
var merge = require('deepmerge')
var path = require('path')
var obj = require('object-path')
var sessions = require('client-sessions')
var bodyParser = require('body-parser')
var fs = require('fs')

var build = require('./lib/build')
var routes = require('./lib/routes')

var bleh = module.exports = function bleh (options) {
  var self = this
  options = options || {}
  if (!options.caller) {
    options.caller = module.parent.filename
  }
  if (!(this instanceof bleh)) {
    return new bleh(options)
  }

  var app = express()
  self.app = app
  self.root = path.dirname(options.caller)
  if (options.root) {
    self.root = options.root
  }

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.set('json spaces', 2)

  if (options.log) {
    app.use(function (req, res, next) {
      options.log(req.method, req.url)
      next()
    })
  }

  var sessionSecret = obj.get(options, 'sessions.secret')
  if (sessionSecret) {
    app.use(sessions({
      cookieName: 'session',
      secret: sessionSecret
    }))
  }

  app.on('mount', function (parent) {
    self.app.parent = parent
  })

  if (process.env.NODE_ENV !== 'production') {
    build({
      root: self.root,
      main: options.main || self.root
    }, function () {
      self.start(options)
    })
  } else {
    process.nextTick(function () {
      self.start(options)
    })
  }
  return app
}

bleh.prototype.ready = function () {
  var self = this
  self.app.emit('ready', true)
  if (self.app.parent) {
    self.app.parent.emit('ready', true)
  }
}

bleh.prototype.start = function (options) {
  options = options || {}
  var defaults = {
    https: false,
    helpers: {},
    log: console.log,
    root: this.root,
    home: '/home'
  }
  var opts = merge(defaults, options)

  opts.helpers = require('./lib/helpers')(opts)

  var app = this.app

  // redirect to https
  if (opts.https && process.env.NODE_ENV === 'production') {
    app.use(function(req, res, next) {
      var secure = (req.headers['x-forwarded-proto'] === 'https')
      if (!secure) {
        return res.redirect(['https://', req.get('Host'), req.url].join(''))
      }
      next()
    })
  }

  // serve static files
  app.static = function (uri, path) {
    app.use(uri, express.static(path))
  }
  app.static('/', path.join(opts.root, 'public'))

  // routes
  app.use('/', routes(opts))

  this.ready()

  return app
}
