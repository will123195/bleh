var path = require('path')
var exec = require('child_process').exec;
var async = require('async')
var xtend = require('xtend')
var fs = require('fs')
var mkdirp = require('mkdirp')

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

// opts.paths
// opts.dist
module.exports = function (options, cb) {
  var cwd = process.cwd()
  var defaults = {
    handlebars: path.join(cwd, 'node_modules/.bin/handlebars'),
    paths: [
      path.join(cwd, 'partials'),
      path.join(cwd, 'layouts'),
      path.join(cwd, 'pages'),
      path.join(cwd, 'node_modules/bleh/global/layouts')
    ],
    dist: 'public/dist'
  }
  var opts = xtend(defaults, options)
  //console.log('opts:', opts)

  var templates = {}
  var dir = path.join(cwd, opts.dist)
  mkdirp.sync(dir)
  var paths = opts.paths.join(' ')

  async.waterfall([
    function (next) {
      var command = [
        opts.handlebars,
        opts.paths.join(' '),
        '-e html',
        '-r ' + cwd
      ].join(' ')
      exec(command, next)
    },
    function (stdout, stderr, next) {
      var lines = stdout.split('\n')
      lines[0] = 'module.exports = function (Handlebars) {'
      lines[1] = 'var template = Handlebars.template, templates = {};'
      lines.pop()
      lines.push('return templates;')
      lines.push('}')
      lines.forEach(function (line, i) {
        var pattern = /templates\[\'(.*)\'\] = template/
        var match = line.match(pattern)
        if (match && match.index === 0) {
          var view = getViewName(match[1])
          lines[i] = '\n' + line.replace(match[1], view)
        }
      })
      var file = path.join(dir, 'templates.js')
      fs.writeFileSync(file, lines.join('\n'))
      next()
    }
  ], cb)

}
