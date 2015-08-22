//var templates = require('../../../../public/dist/templates.js')

window.render = function (name, data) {
  return Handlebars.templates[name](data)
}