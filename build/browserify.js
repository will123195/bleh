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

  // browserify common client-side dependencies
  var commonDependencies = package.browserifyCommonDependencies || []
  var commonUri = '/' + dist + '/common.js'
  var filename = path.join(root, commonUri)
  var b = browserify()
  b.require(commonDependencies)
  b.require(root + '/public/dist/templates.js', {
    expose: 'handlebars-templates'
  })
  b.require(root + '/lib/handlebars-helpers.js', {
    expose: 'handlebars-helpers'
  })
  b.bundle(function(err, buf) {
    if (err) throw new Error(err)
    write(filename, buf)

    async.each(paths, function (dir, done) {
      scan({
        root: dir
      })
      .file('**/*browserify.js', saveBrowserify)
      .done(done)
    }, cb)

  })

  function saveBrowserify (file) {
    var view = file.name.replace('.browserify.js', '')
    view = getViewName({
      name: view
    })
    var filename = root + '/' + dist + '/' + view + '.js'
    var b = browserify()
    b.add(file.filename)
    b.external(commonDependencies.concat([
      'handlebars-templates',
      'handlebars-helpers'
    ]))
    b.bundle(function(err, buf) {
      if (err) throw new Error(err)
      write(filename, buf)
    })

    // js[file.dir] = []
    // js[file.dir].push(commonUri)
    // js[file.dir].push(uri)

    // layoutJs[file.dir] = layoutJs[file.dir] || []
    // layoutJs[file.dir].push(commonUri)
    // layoutJs[file.dir].push(uri)

    // pageJs[file.dir] = pageJs[file.dir] || []
    // pageJs[file.dir].push(uri)
  }

}

function write (filename, buf) {
  mkdirp.sync(path.dirname(filename))
  fs.writeFileSync(filename, buf)
}