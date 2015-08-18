// this happens at startup
// $.pages.home.js = ['/dist/pages/home.js']
// $.pages.home.css = ['/dist/pages/home.css']
// $.layouts.website.css = ['/dist/layouts/website.css']
// $.layouts.website.js ['/dist/layouts/website.js']

// this happens when the route is created
// $.css.append($.pages.home.css)
// $.js.append($.pages.home.js)

// $.pages.home.bind($)($)
module.exports = function ($) {

  $.title = 'Home'

  $.js.push('/vendor/kitten.js')

  //console.log('$:', $)

  $.layout('website')
  // shortcut for:
  // $.css.push($.layouts.website.css)
  // $.js.push($.layouts.website.js)
  // $.layouts.website.bind($)($);

  //console.log('now:', $.now) // set in website.node.js

  $.render()

  // var html = $.layouts.html5.render({
  //   main: $.layouts.website.render({
  //     main: $.pages.home.render($)
  //   }
  // })
  // $.send(html)

}