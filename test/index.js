var test = require('tape');
var http = require('http');
var servertest = require('servertest');
var express = require('express')


test('start the app', function (t) {
  var app = express();
  var server = http.createServer(function (req, res) {
    t.equal(req.url, '/home');
    t.equal(req.headers['x-beep'], 'boop');
    res.statusCode = 418;
    res.end('beep boop');
  }).listen(0, function () {

  });
});
