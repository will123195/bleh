module.exports = function ($) {
  $.js.push('/dist/shared.js')
  $.js = $.js.reverse()
  $.css = $.css.reverse()
}