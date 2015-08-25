var app = require('./index')
var package = require('./package.json')

var port = process.env.PORT || 8080

app.on('ready', function () {
  app.listen(port, function () {
    console.log([
      package.name + ' ' + package.version,
      'Running: http://localhost:' + port,
      'NODE_ENV: ' + process.env.NODE_ENV,
    ].join('\n'))
  })
})
