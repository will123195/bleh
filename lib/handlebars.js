var path = require('path')
var sys = require('sys')
var scan = require('sugar-glob')
var exec = require('child_process').exec;
var async = require('async')
var xtend = require('xtend')
var fs = require('fs')
var Handlebars = require('handlebars')
var mkdirp = require('mkdirp')

function getViewName (file, ext) {
  var cwd = process.cwd() + path.sep
  var view = file.filename
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

Handlebars.partials = Handlebars.templates

module.exports.handlebars = Handlebars

// opts.paths
// opts.dist
module.exports.build = function (options, cb) {
  var cwd = process.cwd()
  var defaults = {
    handlebars: path.join(cwd, 'node_modules/.bin/handlebars'),
    paths: [
      path.join(cwd, 'partials'),
      path.join(cwd, 'layouts'),
      path.join(cwd, 'pages'),
      path.join(cwd, 'node_modules/bleh/layouts')
    ],
    dist: 'public/dist'
  }
  var opts = xtend(defaults, options)
  console.log('opts:', opts)

  var templates = {}
  async.series([
    // function (done) {
    //   async.each(opts.paths, function (path, next) {
    //     scan({
    //       root: path,
    //       wildcard: '$'
    //     })
    //     .file('**/*.html', function(file) {
    //       var view = getViewName(file, '.html')
    //       var html = fs.readFileSync(file.filename, 'utf8')
    //       templates[view] = Handlebars.compile(html)
    //     })
    //     .done(next)
    //   }, function () {
    //     var test = funcster.deepSerialize(templates)
    //     console.log('test:', test)
    //     done()
    //   })
    // },
    function (done) {
      var dir = path.join(cwd, opts.dist)
      mkdirp.sync(dir)
      var paths = opts.paths.join(' ')
      var filename = path.join(dir, 'templates-client.js')

      async.series([
        function (next) {
          var command = [
            opts.handlebars,
            opts.paths.join(' '),
            '-e html',
            '-r ' + cwd,
            '-f ' + filename
          ].join(' ')
          console.log('command:', command)
          exec(command, next)
        },
        function (next) {
          var lines = fs.readFileSync(filename, 'utf8').split('\n')
          lines[0] = 'module.exports = function (Handlebars) {'
          lines[1] = 'var template = Handlebars.template, templates = {};'
          lines.pop()
          lines.push('return templates;')
          lines.push('}')
          var file = path.join(dir, 'templates.js')
          fs.writeFileSync(file, lines.join('\n'))
          next()
        }
      ], done)
    }
  ], cb)
}
