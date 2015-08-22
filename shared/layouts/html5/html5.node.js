var handlebarsRuntimeUrl =
  '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/'
  + require('handlebars/package.json').version
  + '/handlebars.runtime.min.js'

module.exports = function ($) {
  $.js.push('/dist/common.js')
  $.js.push(handlebarsRuntimeUrl)

  $.js = $.js.reverse()
  $.css = $.css.reverse()
}