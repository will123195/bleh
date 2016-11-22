var path = require('path')

var Page = module.exports = function (controller, helpers, req, res) {
  var self = this

  if (!(this instanceof Page)) {
    return new Page(controller, helpers, req, res)
  }

  if (typeof controller !== 'function') {
    throw new Error('express-page expects first argument to be a function.')
  }

  self.req = req
  self.res = res
  self.js = []
  self.css = []
  self.templates = {}
  self._controller = controller
  self._view = null
  self._layout = null
  self._layouts = []

  helpers = helpers || {}
  self.set(helpers)

  return self
}

Page.prototype.run = function () {
  return this._controller(this)
}

Page.prototype.set = function (helpers) {
  var self = this
  Object.keys(helpers).forEach(function (helper) {
    self[helper] = helpers[helper]
  })
  return self
}

Page.prototype.notFound = function () {
  this.res.status(404).send('Not found.')
  return this
}

Page.prototype.accessDenied = function () {
  this.res.status(403).send('Access denied.')
  return this
}

Page.prototype.redirect = function () {
  this.res.redirect.apply(this.res, arguments)
  return this
}

Page.prototype.render = function () {
  var self = this
  if (!self.templates[this._view]) {
    var base = path.basename(self._view)
    var msg = 'Missing ' + self._view + '/' + base + '.html'
    throw new Error(msg)
  }
  var html = self.templates[self._view](self)
  self._layouts.forEach(function (layout) {
    self.main = html
    if (self.templates[layout]) {
      html = self.templates[layout](self)
    }
  })
  self.res.send(html)
  return self
}

Page.prototype.setLayout = function (template) {
  this._layout = template
  return this
}

Page.prototype.setView = function (template) {
  this._view = template
  return this
}
