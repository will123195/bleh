var name = require('../../package.json').name

module.exports = function ($) {
  $.title = name
  $.layout('website')
  $.render()
}