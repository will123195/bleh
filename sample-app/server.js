var app = require('./index')

app.on('ready', function () {
  app.listen(app.get('port'), function () {
    console.log([
      'Bleh Sample App',
      'Running: http://localhost:' + app.get('port'),
      'process.env.NODE_ENV: ' + process.env.NODE_ENV,
    ].join('\n'))
  })
})
