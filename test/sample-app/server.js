var app = require('..')

app.listen(app.get('port'), function () {
  console.log([
    'My Bleh App',
    'Running: http://localhost:' + app.get('port'),
    'process.env.NODE_ENV: ' + process.env.NODE_ENV,
  ].join('\n'))
})