var fs = require('fs')
var less = require('less')
var async = require('async')
var scan = require('sugar-glob')
var MD5 = require('MD5')
var path = require('path')
var mkdirp = require('mkdirp')
var getViewName = require('../lib/get-view-name')

module.exports = function (opts, cb) {
  var cwd = process.cwd()
  var dist = 'public/dist'
  var assetsUri = '/dist/'
  var paths = [
    cwd + '/pages',
    cwd + '/layouts',
    cwd + '/node_modules/bleh/shared/layouts'
  ]

  var css = {}
  var files = []

  async.each(paths, function (dir, done) {
    scan({
      root: dir
    })
    .file('**/*.less', function (file) {
      files.push(file)
    })
    .done(done)
  }, function (err) {
    if (err) {
      return cb(err)
    }
    async.each(files, saveLess, function (err) {
      if (err) {
        console.log('LESS:', err)
        return cb(err)
      }
      console.log('css:', css)
      cb(null, css)
    })
  })

  function saveLess (file, done) {
    var lessCode = fs.readFileSync(file.filename, 'utf8')
    less.render(lessCode, {
      paths: [                // Specify search paths for @import directives
        cwd,
        cwd + '/node_modules/bleh/shared'
      ],
      filename: file.name,    // Specify a filename, for better error messages
      compress: false         // Minify CSS output
    }, function (err, cssCode) {
      if (err) {
        return done(err)
      }
      var cachebust = MD5(cssCode.css).substring(0, 8)
      var name = file.filename.replace(cwd + '/', '')
      var view = getViewName(name.replace('.less', ''))
      var uri = assetsUri + view + '.css'
      var filename = path.normalize(cwd + '/' + dist + '/' + view + '.css')
      mkdirp.sync(path.dirname(filename))
      fs.writeFileSync(filename, cssCode.css)
      css[view] = css[view] || []
      css[view].push(uri + '?' + cachebust)
      done()
    })
  }
}