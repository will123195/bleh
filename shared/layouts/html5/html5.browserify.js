//var templates = require('dist/')

window.render = function (name, data) {
  return Handlebars.templates[name](data)
}