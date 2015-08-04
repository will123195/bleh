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

var mainstream = module.exports = function (app, opts) {

  var reqPath = path.dirname(module.parent.filename)

  var defaults = {
    https: true,
    log: console.log
  }

  var opts = xtend(defaults, opts)


  // start session
  var sessionSecret = obj.get(opts, 'sessions.secret')
  if (!sessionSecret) {
    return console.error("sessions.secret must be at least 20 chars.")
  } else {
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
  var pages = require('express-pages')
  app.use('/', pages({
    dir: reqPath + '/' + (opts.dir || 'pages'),
    ext: opts.ext || '.node.js'
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
