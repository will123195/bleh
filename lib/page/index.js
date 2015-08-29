var async = require('async')
var exec = require('child_process').exec
var chalk = require('chalk')
var path = require('path')
var fs = require('fs')

// opts.root
module.exports = function (opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  opts = opts || {}
  cb = cb || function () {}

  var root = opts.root || process.cwd()

  var extensions = [
    '.browserify.js',
    '.less',
    '.node.js',
    '.html'
  ]
  async.eachSeries(extensions, function (ext, next) {
    var base = opts.name.split('/').pop()
    var file = root + '/pages/' + opts.name + '/' + base + ext
    if (fs.existsSync(file)) {
      return next()
    }
    var dir = path.dirname(file)
    var command = 'mkdir -p ' + dir + ' && touch ' + file
    var cmd = exec(command)
    cmd.stdout.pipe(process.stdout)
    cmd.stderr.pipe(process.stderr)

    if (ext === '.node.js') {
      fs.writeFileSync(file, [
        'module.exports = function ($) {',
        "  $.title = '" + opts.name + "'",
        "  $.layout('html5')",
        '  $.render()',
        '}'
      ].join('\n'))
    }
    if (ext === '.html') {
      fs.writeFileSync(file, opts.name)
    }

    cmd.on('exit', next)
  }, function (err) {
    if (err) {
      return
    }
    console.log(chalk.cyan('bleh:page created pages/' + opts.name))
  })

}