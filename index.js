try {
  var express = require('express')
} catch (err) {
  // in case you have this module npm linked
  var prequire = require('parent-require')
  var express = prequire('express')
}
var xtend = require('xtend')
var path = require('path')
var obj = require('object-path')
var sessions = require('client-sessions')
var bodyParser = require('body-parser')

var build = require('./build')
var routes = require('./lib/routes')

var bleh = module.exports = function bleh (options) {
  var self = this
  if (!(this instanceof bleh)) {
    return new bleh(options)
  }

  var app = express()

  self.app = app
  self.root = path.dirname(module.parent.filename)

  app.on('mount', function (parent) {
    self.app.parent = parent
  })

  if (process.env.NODE_ENV !== 'production') {
    build({
      root: self.root
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
    https: true,
    log: console.log,
    root: this.root,
    home: 'home'
  }
  var opts = xtend(defaults, options)

  var reqPath = path.dirname(module.parent.filename)

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

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.set('json spaces', 2)

  // log requests
  if (opts.log) {
    app.use(function (req, res, next) {
      opts.log(req.method, req.url)
      next()
    })
  }

  // start session
  var sessionSecret = obj.get(opts, 'sessions.secret')
  if (sessionSecret) {
    app.use(sessions({
      cookieName: 'session',
      secret: sessionSecret
    }))
  }

  // serve static files
  app.static = function (uri, path) {
    app.use(uri, express.static(path))
  }
  app.static('/', reqPath + '/public')

  // routes
  app.use('/', routes(opts))

  this.ready()

  return app
}
