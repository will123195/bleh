var test = require('tape')
var request = require('request')
var http = require('http')

var app = require('../sample-app')
var port = 5555
app.set('port', port)
var server = http.createServer(app);

var get = function (uri, cb) {
  var url = 'http://localhost' + ':' + port + uri
  request.get(url, cb)
}

test('start server', function (t) {
  app.on('ready', function () {
    server.listen(port, t.end.bind(t))
  })
})

test('url params', function (t) {
  get('/1-2', function (err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    var data = JSON.parse(res.body)
    t.equal(data.low, '1')
    t.equal(data.high, '2')
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
    t.equal(res.statusCode, 404)
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

test('/ping', function (t) {
  get('/ping', function(err, res) {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.end()
  })
})

test('webdriver', function (t) {
  t.end()
})

test('done', function (t) {
  server.close()
  t.end()
})
