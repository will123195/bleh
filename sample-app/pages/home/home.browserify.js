var xtend = require('xtend')
var hello = require('./hello')

console.log('home.browserify.js')

var test = xtend({
  a: 1
}, {
  b: 2
})

console.log('test:', test)

hello()
hello()

var html = render('partials/header', {
  title: 'render test!'
})

console.log('html:', html)