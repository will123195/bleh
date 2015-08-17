var test = require('tape')
var request = require('request')
var http = require('http')

var app = require('./sample-app')
var port = app.get('port')
var server = http.createServer(app);

var get = function (uri, cb) {
  var url = 'http://localhost' + ':' + app.get('port') + uri
  console.log('url:', url)
  request.get(url, cb)
}

test('start server', function (t) {
  server.listen(port, t.end.bind(t))
})

test('/', function (t) {
  get('/', function(err, res) {
    t.error(err)
    t.equal(200, res.statusCode)
    t.end()
  })
})

test('/home', function (t) {
  t.end()
})

test('/dist/home.js', function (t) {
  t.end()
})

test('/dist/home.css', function (t) {
  t.end()
})

test('/home/kitten', function (t) {
  t.end()
})

test('/ping', function (t) {
  get('/ping', function(err, res) {
    t.error(err)
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
