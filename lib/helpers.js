var path = require('path')

// opts.__root
module.exports = function (opts) {
  var controllers = require('./controllers')(opts)

  var handlebarsPath = path.join(opts.__root, 'lib/handlebars.js')
  var handlebars = require(handlebarsPath)
  var templatesPath = path.join(opts.__root, 'public/dist/templates.js')
  var getTemplates = require(templatesPath)
  var templates = getTemplates(handlebars)

  handlebars.partials = templates

  return {
    layout: function (layout) {
      this._layout = 'layouts/' + layout
      controllers[this._layout].bind(this)(this)
    },
    //handlebars: handlebars.handlebars,
    templates: templates
  }
}