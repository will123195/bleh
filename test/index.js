var test = require('tape')
var request = require('request')
var http = require('http')
var path = require('path')
var fs = require('fs')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')

var server
var port = 5555
var src = path.join(__dirname, '..', 'sample-app', 'node_modules')
var dist = path.join(__dirname, '..', 'sample-app', 'public', 'dist')

var get = function (uri, cb) {
  var url = 'http://localhost:' + port + uri
  request.get({
    url: url,
    followRedirect: false
  }, cb)
}

test('clean', function (t) {
  rimraf.sync(src)
  rimraf.sync(dist)
  t.end()
})

test('ensure sample-app symlinks exist', function (t) {
  mkdirp.sync(src)
  var links = [
    {
      src: path.join(src, '.bin'),
      target: path.join('..', '..', 'node_modules', '.bin')
    },
    {
      src: path.join(src, 'bleh'),
      target: path.join('..', '..')
    },
    {
      src: path.join(src, 'handlebars'),
      target: path.join('..', '..', 'node_modules', 'handlebars')
    }
  ]
  links.forEach(function (link) {
    try {
      fs.symlinkSync(link.target, link.src, 'dir')
    } catch (err) {}
  })
  t.end()
})

test('start server', function (t) {
  var app = require('../sample-app')
  server = http.createServer(app);
  app.on('ready', function () {
    server.listen(port, t.end.bind(t))
  })
})

test('url params', function (t) {
  get('/1-2.json', function (err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    try {
      var data = JSON.parse(res.body)
      t.equal(data.low, '1')
      t.equal(data.high, '2')
    } catch (e) {
      t.error('invalid json: ' + res.body)
    }
    t.end()
  })
})

test('homepage', function (t) {
  get('/', function(err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.end()
  })
})

test('canonical homepage', function (t) {
  get('/home', function (err, res) {
    t.error(err)
    t.equal(res.statusCode, 302)
    t.end()
  })
})

test('static files', function (t) {
  get('/robots.txt', function (err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.end()
  })
})

test('page js', function (t) {
  get('/dist/pages/home.js', function(err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.end()
  })
})

test('page css', function (t) {
  get('/dist/pages/home.css', function(err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.end()
  })
})

test('layout js', function (t) {
  get('/dist/layouts/website.js', function(err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.end()
  })
})

test('layout css', function (t) {
  get('/dist/layouts/website.css', function(err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.end()
  })
})

test('shared layout js', function (t) {
  get('/dist/layouts/html5.js', function(err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.end()
  })
})

test('shared layout css', function (t) {
  get('/dist/layouts/html5.css', function(err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.end()
  })
})

test('/ping', function (t) {
  get('/ping', function(err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.end()
  })
})

test('TODO webdriver', function (t) {
  t.end()
})

test('done', function (t) {
  server.close()
  t.end()
})
