var scan = require('sugar-glob')
var path = require('path')
var async = require('async')
var debug = require('debug')('controllers')

// duplicate of lib/handlebars.js
function getViewName (name, ext) {
  ext = ext || ''
  var cwd = process.cwd() + path.sep
  var view = name
    .replace(cwd, '')
    .replace(ext, '')
    .replace('node_modules/bleh/', '')
    .split(path.sep)
  var len = view.length
  if (len > 1 && view[len-1] === view[len-2]) {
    view.pop()
  }
  return view.join(path.sep)
}

// opts.__root
module.exports = function (opts) {
  var controllers = {}

  var paths = [
    path.join(opts.__root, 'node_modules/bleh/global'),
    opts.__root
  ]
  async.each(paths, function (dir, next) {
    scan({
      root: dir,
      wildcard: '$'
    })
    .file('**/*.node.js', function(file) {
      var name = file.name.replace('.node.js', '')
      name = getViewName(name)
      controllers[name] = require(file.filename)
    })
    .done(next)
  }, function () {
    debug(controllers)
  })


  return controllers
}