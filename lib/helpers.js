var path = require('path')
var handlebars = require('./handlebars')

// opts.__root
module.exports = function (opts) {
  var templatesPath = path.join(opts.__root, 'public/dist/templates.js')
  var templates = require(templatesPath)(handlebars.handlebars)

  handlebars.handlebars.partials = templates

  return {
    layout: function () {},
    //handlebars: handlebars.handlebars,
    templates: templates
  }
}