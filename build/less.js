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

  async.each(paths, function (dir, done) {
    scan({
      root: dir
    })
    .file('**/*.less', saveLess)
    .done(done)
  }, function (err) {
    if (err) {
      return cb(err)
    }
    console.log('css:', css)
    cb()
  })

  function saveLess (file) {
    console.log('file:', file)
    var lessCode = fs.readFileSync(file.filename, 'utf8')
    css[file.dir] = []
    less.render(lessCode, {
      paths: [                // Specify search paths for @import directives
        cwd,
        cwd + '/node_modules/bleh/shared'
      ],
      filename: file.name,    // Specify a filename, for better error messages
      compress: false         // Minify CSS output
    }, function (err, cssCode) {
      if (err) {
        console.log('LESS:', err)
        return
      }
      var cachebust = MD5(cssCode.css).substring(0, 8)
      var name = file.filename.replace(cwd, '')
      var view = getViewName(name.replace('.less', ''))
      var uri = assetsUri + view + '.css'
      var filename = path.normalize(cwd + '/' + dist + '/' + view + '.css')
      mkdirp.sync(path.dirname(filename))
      fs.writeFileSync(filename, cssCode.css)
      css[file.dir].push(uri + '?' + cachebust)
    })
  }
}