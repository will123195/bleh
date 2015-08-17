var scan = require('sugar-glob')
var path = require('path')
var async = require('async')

// opts.__root
module.exports = function (opts) {
  var controllers = {}

  var paths = [
    opts.__root,
    // path.join(opts.__root, 'layouts'),
    // path.join(opts.__root, 'pages'),
    path.join(opts.__root, 'node_modules/bleh')
  ]

  async.each(paths, function (dir, next) {
    scan({
      root: dir,
      wildcard: '$'
    })
    .file('**/*.node.js', function(file) {
      console.log('controller:', file)
      var name = file.name.replace('.node.js', '')
      controllers[name] = require(file.filename)
    })
  })


  return controllers
}