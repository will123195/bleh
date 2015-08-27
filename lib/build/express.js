var fs = require('fs')
var async = require('async')
var scan = require('sugar-glob')
var path = require('path')
var mkdirp = require('mkdirp')
var getViewName = require('../../lib/get-view-name')

module.exports = function (opts, cb) {
  var root = opts.root || process.cwd()
  var dist = opts.dist || 'public/dist'
  var paths = [
    path.join(root, 'pages'),
    path.join(root, 'layouts'),
    path.join(root, 'node_modules', 'bleh', 'shared', 'layouts')
  ]
  var controllers = {}
  async.each(paths, function (dir, next) {
    console.log('express dir:', dir)
    scan({
      root: dir,
      wildcard: '$'
    })
    .file('**' + path.sep + '*.node.js', function(file) {
      var name = getViewName({
        name: file.filename,
        ext: '.node.js',
        root: root
      })
      console.log('name:', name)
      controllers[name] = {
        path: file.filename.replace(root + path.sep, '')
      }
      var base = file.filename.replace('.node.js', '')
      if (fs.existsSync(base + '.less')) {
        controllers[name].css = true
      }
      if (fs.existsSync(base + '.browserify.js')) {
        controllers[name].js = true
      }
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