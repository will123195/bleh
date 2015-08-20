var path = require('path')

// opts.root
module.exports = function (opts) {
  var controllers = require('./controllers')(opts)
  var handlebarsPath = path.join(opts.root, 'lib/handlebars.js')
  var handlebars = require(handlebarsPath)
  var templatesPath = path.join(opts.root, 'public/dist/templates.js')
  var getTemplates = require(templatesPath)
  var templates = getTemplates(handlebars)

  handlebars.partials = templates

  return {
    layout: function (layout) {
      this._layout = 'layouts/' + layout
      this.css.push('/dist/' + this._layout + '.css')
      this.js.push('/dist/' + this._layout + '.js')
      console.log('this._layout:', this._layout)
      console.log('controllers:', controllers)
      controllers[this._layout].bind(this)(this)
    },
    //handlebars: handlebars.handlebars,
    templates: templates
  }
}