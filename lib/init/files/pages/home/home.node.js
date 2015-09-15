module.exports = function ($) {
  $.title = require('../../package.json').name
  $.layout('website')
  $.render()
}