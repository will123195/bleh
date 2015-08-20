var handlebarsVersion = require('handlebars/package.json').version
var handlebarsRuntimeUrl =
  '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/'
  + handlebarsVersion
  + '/handlebars.runtime.min.js'

module.exports = function ($) {
  $.js.push('/dist/shared.js')
  $.js.push(handlebarsRuntimeUrl)

  $.js = $.js.reverse()
  $.css = $.css.reverse()
}