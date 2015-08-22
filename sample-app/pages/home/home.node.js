module.exports = function ($) {
  $.title = 'Home'
  $.js.push('/vendor/kitten.js')
  $.layout('website')
  $.query.cats = $.query.cats || 1
  $.anotherCat = parseInt($.query.cats, 10) + 1
  $.session.counter = $.session.counter || 0
  $.session.counter++
  $.render()
}