var fs = require('fs')
var async = require('async')
var scan = require('sugar-glob')
var path = require('path')
var mkdirp = require('mkdirp')
var getViewName = require('../../lib/get-view-name')

// opts.root
// opts.main
// opts.dist
module.exports = function (opts, cb) {
  var root = opts.root
  var dist = opts.dist || 'public/dist'
  var paths = [
    path.join(root, 'pages'),
    path.join(root, 'layouts'),
    path.join(opts.main, 'node_modules', 'bleh', 'shared', 'layouts')
  ]
  var depth = opts.root.replace(opts.main, '').split(path.sep).length - 1
  var up = ''
  for (var i = 1; i <= depth; i++) {
    up += '../'
  }
  var controllers = {}
  async.each(paths, function (dir, next) {
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
      name = getViewName({
        name: name,
        ext: '.node.js',
        root: opts.main
      })
      var controllerPath = file.filename
      controllerPath = controllerPath.replace(root + path.sep, '')
      controllerPath = path.normalize(controllerPath.replace(opts.main + path.sep, up))
      controllers[name] = {
        path: controllerPath
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