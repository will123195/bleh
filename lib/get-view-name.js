var path = require('path')

module.exports = function getViewName (name, ext) {
  ext = ext || ''
  var cwd = process.cwd() + path.sep
  var view = name
    .replace(cwd, '')
    .replace(ext, '')
    .replace('node_modules/bleh/shared/', '')
    .split(path.sep)
  var len = view.length
  if (len > 1 && view[len-1] === view[len-2]) {
    view.pop()
  }
  return view.join(path.sep)
}