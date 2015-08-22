module.exports = function ($) {
  $.now = Date.now()
  $.year = new Date().getFullYear()
  $.layout('html5')
}