module.exports = function ($) {
  $.title = 'Home'
  $.js.push('/vendor/kitten.js')
  $.layout('website')
  $.render()
}