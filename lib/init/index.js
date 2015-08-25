var async = require('async')
var fs = require('fs-extra')
var merge = require('deepmerge')
var exec = require('child_process').exec
var chalk = require('chalk')
var path = require('path')

// opts.root
// opts.jquery
// opts.fontawesome
module.exports = function (options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  options = options || {}
  cb = cb || function () {}

  var root = options.root || process.cwd()

  var opts = merge({
    root: root
  }, options)

  console.log(chalk.yellow('Installing packages'))

  var commands = [
    //'npm install --save bleh browserify less express handlebars',
    'npm install --save-dev nodemon'
  ]
  async.eachSeries(commands, function (command, next) {
    console.log(chalk.magenta(command))
    var cmd = exec(command)
    cmd.stdout.pipe(process.stdout)
    cmd.stderr.pipe(process.stderr)
    cmd.on('exit', next)
  }, function (err) {
    if (err) {
      return
    }

    console.log(chalk.yellow('Updating package.json'))
    var file = root + '/package.json'
    var orig = require(file)
    var add = require('./files/package.json')
    var data = JSON.stringify(merge(orig, add, orig), null, 2)
    console.log('data:', data)
    fs.writeFileSync(file, data)

    console.log(chalk.yellow('Creating website files'))
    var source = __dirname + '/files/'
    fs.copySync(source, root, {
      filter: function (file) {
        if (path.basename(file) === 'package.json') {
          return false
        }
        return true
      }
    })
    var filename = root + '/layouts/website/website.node.js'
    var lines = fs.readFileSync(filename, 'utf8').split('\n')
    var addLine = function (line) {
      if (lines.indexOf(line) === -1) {
        lines.splice(1, 0, line)
      }
    }
    if (opts.jquery) {
      addLine("  $.js.push('//code.jquery.com/jquery-2.1.4.min.js')")
    }
    if (opts.fontawesome) {
      addLine("  $.css.push('//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css')")
    }
    fs.writeFileSync(filename, lines.join('\n'))

    console.log(chalk.cyan('bleh:init done'))
    console.log('Type ' + chalk.inverse('npm start') + ' to run your app.')
  })

}
