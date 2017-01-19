'use strict'

process.env.NODE_ENV = 'test'

const port = process.env.PORT || 5556
const test = require('ava').serial.cb
const idiot = require('idiot')
const client = idiot({
  baseUrl: 'http://localhost:' + port
})

let server

test('Initialize app', function (t) {
  const app = require('..')
  app.on('ready', function () {
    server = app.listen(port, function () {
      t.end()
    })
  })
})

test('Healthcheck', function (t) {
  client.get('/').then(function () {
    t.end()
  })
})

test('Shutdown', function (t) {
  server.close(function () {
    t.end()
  })
})