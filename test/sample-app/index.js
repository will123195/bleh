var express = require('express')
var bleh = require('bleh')
var app = express()

app.set('port', (process.env.PORT || 5000))

app.use('/', bleh({
  // default options
  pages: [__dirname + '/pages'],
  layouts: [
    __dirname + '/layouts',
    __dirname + '/node_modules/bleh/test/sample-app/layouts'
  ],
  partials: [__dirname + '/partials'],
  public: [__dirname + '/public'],
  dist: [__dirname + '/public/dist'],
  home: 'home',
  ext: {
    browserify: '.browserify.js',
    less: '.less',
    node: '.node.js',
    handlebars: '.html'
  },
  helpers: {

  },
  sessions: false
}))

app.listen(app.get('port'), function () {
  console.log([
    'My Bleh App',
    'Running: http://localhost:' + app.get('port'),
    'process.env.NODE_ENV: ' + process.env.NODE_ENV,
  ].join('\n'))
})