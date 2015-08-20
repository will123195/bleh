var path = require('path')

// opts.name
// opts.ext
// opts.root
module.exports = function getViewName (opts) {
  var ext = opts.ext || ''
  var root = opts.root || process.cwd()
  root = root + path.sep
  var view = opts.name
    .replace(root, '')
    .replace(ext, '')
    .replace('node_modules/bleh/shared/', '')
    .split(path.sep)
  var len = view.length
  if (len > 1 && view[len-1] === view[len-2]) {
    view.pop()
  }
  return view.join(path.sep)
}