//var templates = require('dist/')

console.log('html5.browserify.js')

window.render = function (name, data) {
  return Handlebars.templates[name](data)
}