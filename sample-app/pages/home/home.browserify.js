var xtend = require('xtend')

var data = xtend({
  a: 1
}, {
  b: 2
})

console.log('data:', data)

var html = render('partials/dump', data)

document.getElementById('client-render').innerHtml = html

