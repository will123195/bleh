var path = require('path')
var clone = require('clone')
var async = require('async')

var handlebars = require('./handlebars')

module.exports = function (opts) {
  var cwd = process.cwd()

  console.log('scan:', cwd)

  if (opts.verbose) {
    console.log('verbose!')
  }

  async.parallel([
    function (done) {
      handlebars.build({}, done)
    },
    // function (done) {
    //   browserify({
    //     paths: paths([
    //       'layouts',
    //       'pages',
    //       'node_modules/bleh/test/sample-app/layouts'
    //     ])
    //   }, done)
    // },
    // function (done) {
    //   less({
    //     paths: paths([
    //       'layouts',
    //       'pages',
    //       'node_modules/bleh/test/sample-app/layouts'
    //     ])
    //   }, done)
    // }
  ], function (err) {
    if (err) {
      return console.log('err:', err)
    }
    console.log('dist:', path.join(cwd, 'public/dist'))
  })
}
