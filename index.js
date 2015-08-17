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

var bleh = module.exports = function bleh (options) {

  if (!(this instanceof bleh)) {
    return new bleh(options)
  }

  options = options || {}
  var defaults = {
    https: true,
    log: console.log
  }
  var opts = xtend(defaults, options)

  var reqPath = path.dirname(module.parent.filename)

  var helpers = require('./lib/helpers')({
    __root: reqPath
  })

  var app = express()

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

  console.log('helpers:', helpers)

  // pages
  var pages = require('express-pages')
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
