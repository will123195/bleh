var fs = require('fs')
var async = require('async')
var scan = require('sugar-glob')
var path = require('path')
var mkdirp = require('mkdirp')
var getViewName = require('../lib/get-view-name')

module.exports = function (opts, cb) {
  var root = opts.root || process.cwd()
  var dist = opts.dist || 'public/dist'
  var paths = [
    root + '/pages',
    root + '/layouts',
    root + '/node_modules/bleh/shared/layouts'
  ]
  var controllers = {}
  async.each(paths, function (dir, next) {
    scan({
      root: dir,
      wildcard: '$'
    })
    .file('**/*.node.js', function(file) {
      var name = getViewName({
        name: file.filename,
        ext: '.node.js',
        root: root
      })
      controllers[name] = file.filename.replace(root + '/', '')
    })
    .done(next)
  }, function () {
    var json = JSON.stringify({
      controllers: controllers
    }, null, 2)
    write(path.join(root, dist, 'controllers.json'), json)
    cb()
  })
}

function write (filename, buf) {
  mkdirp.sync(path.dirname(filename))
  fs.writeFileSync(filename, buf)
}