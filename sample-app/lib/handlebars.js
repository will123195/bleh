var Handlebars = require('handlebars')

Handlebars.registerHelper('dump', function (data) {
  return new Handlebars.SafeString(
    JSON.stringify(data, null, '\t')
  )
})

module.exports = Handlebars