var browserify = require('browserify')
var path = require('path')
var scan = require('sugar-glob')
var async = require('async')
var mkdirp = require('mkdirp')
var fs = require('fs')
var getViewName = require('../lib/get-view-name')

// opts.root
module.exports = function (opts, cb) {

  var root = opts.root || process.cwd()
  var dist = 'public/dist'

  var paths = [
    root,
    root + '/node_modules/bleh/shared'
  ]

  var package = require(root + '/package.json')

  // browserify shared client-side dependencies
  var sharedDependencies = package.browserifySharedDependencies || []
  var sharedUri = '/' + dist + '/shared.js'
  var filename = path.join(root, sharedUri)
  var b = browserify()
  b.require(sharedDependencies)
  b.bundle(function(err, buf) {
    if (err) throw new Error(err)
    write(filename, buf)
  })

  async.each(paths, function (dir, done) {
    scan({
      root: dir
    })
    .file('**/*browserify.js', saveBrowserify)
    .done(done)
  }, cb)

  function saveBrowserify (file) {
    var view = file.name.replace('.browserify.js', '')
    view = getViewName({
      name: view
    })
    var filename = root + '/' + dist + '/' + view + '.js'
    var b = browserify()
    b.add(file.filename)
    b.external(sharedDependencies)
    b.bundle(function(err, buf) {
      if (err) throw new Error(err)
      write(filename, buf)
    })

    // js[file.dir] = []
    // js[file.dir].push(sharedUri)
    // js[file.dir].push(uri)

    // layoutJs[file.dir] = layoutJs[file.dir] || []
    // layoutJs[file.dir].push(sharedUri)
    // layoutJs[file.dir].push(uri)

    // pageJs[file.dir] = pageJs[file.dir] || []
    // pageJs[file.dir].push(uri)
  }

}

function write (filename, buf) {
  mkdirp.sync(path.dirname(filename))
  fs.writeFileSync(filename, buf)
}