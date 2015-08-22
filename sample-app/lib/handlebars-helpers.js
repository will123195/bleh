module.exports = function (Handlebars) {

  Handlebars.registerHelper('dump', function (data) {
    return new Handlebars.SafeString(
      JSON.stringify(data, null, '  ')
    )
  })

  Handlebars.registerHelper('times', function (n, block) {
    var html = '';
    for (var i = 0; i < n; ++i) {
      html += block.fn(i)
    }
    return html
  });

  return Handlebars
}