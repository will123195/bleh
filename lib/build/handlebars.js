var path = require('path')
var exec = require('child_process').exec
var async = require('async')
var merge = require('deepmerge')
var fs = require('fs')
var mkdirp = require('mkdirp')
var getViewName = require('../../lib/get-view-name')

var findHandlebarsBinPath = function () {
  var bin
  require.main.paths.some(function (p) {
    bin = path.join(p, '.bin', 'handlebars')
    return fs.existsSync(bin)
  })
  return bin
}

// opts.root
// opts.main
// opts.paths
// opts.dist
module.exports = function (options, cb) {
  var root = options.root
  var defaults = {
    handlebars: findHandlebarsBinPath(),
    paths: [
      path.join(root, 'partials'),
      path.join(root, 'layouts'),
      path.join(root, 'pages'),
      path.join(options.main, 'node_modules', 'bleh', 'shared', 'layouts')
    ],
    dist: 'public/dist'
  }
  var opts = merge(defaults, options)

  // remove non-existent folders to prevent handlebars error
  var paths = ''
  opts.paths.forEach(function (p, i) {
    if (fs.existsSync(p)) {
      paths += p + ' '
    }
  })

  var templates = {}
  var dir = path.join(root, opts.dist)
  mkdirp.sync(dir)

  async.waterfall([
    function (next) {
      var command = [
        opts.handlebars,
        paths,
        '-e html',
        '-r ' + root
      ].join(' ')
      exec(command, next)
    },
    function (stdout, stderr, next) {
      var lines = stdout.split('\n')
      lines[0] = 'module.exports = function (Handlebars) {'
      lines[1] = 'var template = Handlebars.template, templates = {};'
      lines.pop()
      lines.pop()
      lines.push('')
      lines.push('return templates;')
      lines.push('}')
      lines.forEach(function (line, i) {
        var pattern = /templates\[\'(.*)\'\] = template/
        var match = line.match(pattern)
        if (match && match.index === 0) {
          var view = getViewName({
            name: match[1]
          })
          lines[i] = '\n' + line.replace(match[1], view)
        }
      })
      var file = path.join(dir, 'templates.js')
      fs.writeFileSync(file, lines.join('\n'))
      next()
    }
  ], cb)

}
