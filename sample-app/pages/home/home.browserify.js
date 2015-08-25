var merge = require('deepmerge')

var data = merge({
  a: 1
}, {
  b: 2
})

var html = render('partials/dump', data)

document.getElementById('client-render').innerHTML = html

