module.exports = function (Handlebars) {

  Handlebars.registerHelper('dump', function (data) {
    return new Handlebars.SafeString(
      JSON.stringify(data, null, '  ')
    )
  })

  Handlebars.registerHelper('ifequal', function (a, b, opts) {
    if (a === b) {
      return opts.fn(this)
    }
    return opts.inverse(this)
  })

  return Handlebars
}