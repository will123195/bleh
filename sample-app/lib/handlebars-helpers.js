module.exports = function (Handlebars) {

  Handlebars.registerHelper('dump', function (data) {
    return new Handlebars.SafeString(
      JSON.stringify(data, null, '\t')
    )
  })

  return Handlebars
}