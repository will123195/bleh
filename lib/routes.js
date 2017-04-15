var path = require('path')
var fs = require('fs')
var express = require('express')
var hide = require('hide-property')
var debug = require('debug')('bleh:routes')
var getViewName = require('./get-view-name')
var Page = require('./express-page')
var Promise = require('bluebird')

// opts.root
// opts.helpers
// opts.dist
module.exports = function (opts) {
  var dist = opts.dist || 'public/dist'
  var app = express()
  var filename = path.join(opts.root, dist, 'controllers.json')
  var config = JSON.parse(fs.readFileSync(filename)).controllers
  Object.keys(config).forEach(function (name) {
    var needle = 'pages/'
    if (name.substring(0, needle.length) !== needle) {
      return
    }
    var uri = name.substring(needle.length - 1)
    uri = uri.split('$').join(':')

    if (uri === opts.home) {
      app.get(uri, function (req, res) {
        res.redirect('/')
      })
      uri = '/'
    }

    var controllerPath = path.join(opts.root, config[name].path)
    app.all(uri, function (req, res, next) {
      var controller = require(controllerPath)

      var helpers = opts.helpers || {}
      helpers.get = function (fn) {
        if (this.req.method === 'GET') {
          fn()
        }
      }
      helpers.post = function (fn) {
        if (this.req.method === 'POST') {
          fn()
        }
      }
      helpers.session = req.session
      helpers.query = req.query
      helpers.body = req.body
      helpers.send = function (data) {
        this.res.send(data)
      }
      helpers.error = function (err) {
        if (!err) return
        this.res.status(400).send(err)
      }
      helpers.view = function (name) {
        this.setView(name)
      }

      helpers.js = []
      if (config[name].js) {
        helpers.js.push(req.baseUrl + '/dist/' + name + '.js')
      }
      helpers.css = []
      if (config[name].css) {
        helpers.css.push(req.baseUrl + '/dist/' + name + '.css')
      }

      var page = Page(controller, helpers, req, res)
      page.setView(name)
      // make url params available as this.$param
      parseParams.call(page)
      hide(page, 'req')
      hide(page, 'res')
      hide(page, 'templates')
      hide(page, '_layout')
      hide(page, '_layouts')
      hide(page, '_view')
      return Promise.resolve()
      .then(function () {
        return page.run()
      })
      .catch(next)
    })
  })
  return app
}

function parseParams () {
  var self = this
  Object.keys(self.req.params).forEach(function (param) {
    self['$' + param] = self.req.params[param]
  })
}