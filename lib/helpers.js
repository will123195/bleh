var fs = require('fs')
var path = require('path')
var merge = require('deepmerge')
var handlebars = require('handlebars').create()

// opts.root
// opts.helpers
// opts.dist
module.exports = function (opts) {
  var dist = opts.dist || 'public/dist'
  var assetsUri = dist.replace('public', '') + '/'

  var controllers = require('./controllers')(opts)

  var handlebarsHelpers = path.join(opts.root, 'lib', 'handlebars-helpers.js')
  if (fs.existsSync(handlebarsHelpers)) {
    handlebars = require(handlebarsHelpers)(handlebars)
  }

  var templatesPath = path.join(opts.root, dist, 'templates.js')
  var getTemplates = require(templatesPath)
  var templates = getTemplates(handlebars)
  handlebars.partials = templates

  return merge({
    layout: function (layout) {
      this._layout = 'layouts/' + layout
      this._layouts.push(this._layout)
      if (controllers[this._layout].css) {
        this.css.push(this.req.baseUrl + assetsUri + this._layout + '.css')
      }
      if (controllers[this._layout].js) {
        this.js.push(this.req.baseUrl + assetsUri + this._layout + '.js')
      }
      controllers[this._layout].bind(this)(this)
    },
    templates: templates
  }, opts.helpers)
}