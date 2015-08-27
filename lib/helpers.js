var fs = require('fs')
var path = require('path')
var handlebars = require('handlebars').create()

// opts.root
module.exports = function (opts) {
  var controllers = require('./controllers')(opts)

  var handlebarsHelpers = path.join(opts.root, 'lib', 'handlebars-helpers.js')
  if (fs.existsSync(handlebarsHelpers)) {
    handlebars = require(handlebarsHelpers)(handlebars)
  }

  var templatesPath = path.join(opts.root, 'public', 'dist', 'templates.js')
  var getTemplates = require(templatesPath)
  var templates = getTemplates(handlebars)
  handlebars.partials = templates

  return {
    layout: function (layout) {
      this._layout = 'layouts/' + layout
      this._layouts.push(this._layout)
      if (controllers[this._layout].css) {
        this.css.push('/dist/' + this._layout + '.css')
      }
      if (controllers[this._layout].js) {
        this.js.push('/dist/' + this._layout + '.js')
      }
      controllers[this._layout].bind(this)(this)
    },
    templates: templates
  }
}