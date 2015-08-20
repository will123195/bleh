'use strict';

var ok = require('assert').ok
var express = require('express')
var bodyParser = require('body-parser')
var scan = require('sugar-glob')
var path = require('path')
var Page = require('./express-page')
var hide = require('hide-property')
var debug = require('debug')('express-pages')

//
// opts.dir (required)
// opts.ext
// opts.helpers
// opts.homepage
// opts.log
//
var Pages = module.exports = function Pages (opts) {
  var self = this
  if (!(this instanceof Pages)) {
    return new Pages(opts)
  }
  ok(opts.dir, 'opts.dir is required')
  this.init(opts)
  this.app.on('mount', function (parent) {
    self.parent = parent
  })
  return this.app
}

Pages.prototype.init = function (opts) {
  var ext = opts.ext || '.js'
  var pattern = '**/*' + ext
  var root = path.normalize(opts.dir)
  var app = express()
  this.app = app

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

  var pages = new scan({
    root: root
  })
  pages.file(pattern, function (file) {
    var uri = '/' + file.name
    uri = uri.substring(0, uri.lastIndexOf(ext))

    uri = normalizeUri(uri)

    // $param to :param
    uri = uri.replace(/\$/g, ':')

    if (uri === '/' + opts.homepage) {
      uri = '/'
    }

    debug(uri)

    app.all(uri, function (req, res) {
      var controller = require(file.filename)

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

      helpers.js = []
      helpers.js.push('/dist/pages/' + file.dir + '.js')
      helpers.css = []
      helpers.css.push('/dist/pages/' + file.dir + '.css')

      var page = Page(controller, helpers, req, res)
      page.setView('pages/' + file.dir)
      // make url params available as this.$param
      parseParams.call(page)
      hide(page, 'req')
      hide(page, 'res')
      page.run()
    })

  })
  .done(function () {

  })

}

function parseParams () {
  var self = this
  Object.keys(self.req.params).forEach(function(param) {
    self['$' + param] = self.req.params[param]
  })
}


function normalizeUri (view) {
  view = view.split(path.sep)
  var len = view.length
  if (len > 1 && view[len-1] === view[len-2]) {
    view.pop()
  }
  return view.join(path.sep)
}