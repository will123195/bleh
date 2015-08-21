var path = require('path')
var fs = require('fs')
var debug = require('debug')('controllers')
var getViewName = require('./get-view-name')

// opts.root
module.exports = function (opts) {
  var filename = path.join(opts.root, 'public', 'dist', 'controllers.json')
  var config = JSON.parse(fs.readFileSync(filename)).controllers
  var controllers = {}
  Object.keys(config).forEach(function (name) {
    //console.log('file:', opts.root, config[name], name)
    var file = path.join(opts.root, config[name])
    controllers[name] = require(file)
  })
  return controllers
}