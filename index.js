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
var build = require('./build')

var bleh = module.exports = function bleh (options) {
  var self = this
  if (!(this instanceof bleh)) {
    return new bleh(options)
  }

  var app = express()

  self.app = app
  self.root = path.dirname(module.parent.filename)

  app.on('mount', function (parent) {
    self.parent = parent
  })

  if (process.env.NODE_ENV !== 'production') {
    build({
      root: self.root
    }, function () {
      self.ready()
    })
  } else {
    self.ready()
  }
  return self.start(options)
}

bleh.prototype.ready = function () {
  var self = this
  var interval = setInterval(function () {
    if (self.parent) {
      self.parent.emit('ready', true)
      clearInterval(interval)
    }
  }, 10)
}

bleh.prototype.start = function (options) {
  options = options || {}
  var defaults = {
    https: true,
    log: console.log,
    root: this.root
  }
  var opts = xtend(defaults, options)

  var reqPath = path.dirname(module.parent.filename)

  var helpers = require('./lib/helpers')(opts)

  var app = this.app

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

  // pages
  var pages = require('./lib/express-pages')
  app.use('/', pages({
    dir: reqPath + '/' + (opts.dir || 'pages'),
    ext: opts.ext || '.node.js',
    homepage: 'home',
    helpers: helpers
  }))

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

  return app
}
