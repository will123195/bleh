var path = require('path')
var handlebars = require('./handlebars')

// opts.__root
module.exports = function (opts) {
  var templatesPath = path.join(opts.__root, 'public/dist/templates.js')
  var templates = require(templatesPath)(handlebars.handlebars)

  handlebars.handlebars.partials = templates

  return {
    layout: function (layout) {
      this._layout = 'layouts/' + layout + '/' + layout
      // TODO: run the layout's controller in this context
      //this._controllers[this._layout].bind(this)()
    },
    //handlebars: handlebars.handlebars,
    templates: templates
  }
}