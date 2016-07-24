var path = require('path')
var fs = require('fs')
var debug = require('debug')('controllers')
var getViewName = require('./get-view-name')

// opts.root
// opts.dist
module.exports = function (opts) {
  var dist = opts.dist || 'public/dist'
  var filename = path.join(opts.root, dist, 'controllers.json')
  var config = JSON.parse(fs.readFileSync(filename)).controllers
  var controllers = {}
  Object.keys(config).forEach(function (name) {
    var file = path.join(opts.root, config[name].path)
    controllers[name] = require(file)
    controllers[name].css = config[name].css
    controllers[name].js = config[name].js
  })
  return controllers
}
