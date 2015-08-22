var xtend = require('xtend')

var data = xtend({
  a: 1
}, {
  b: 2
})

var html = render('partials/dump', data)

document.getElementById('client-render').innerHTML = html

