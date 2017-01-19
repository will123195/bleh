var async = require('async')
var fs = require('fs-extra')
var merge = require('deepmerge')
var exec = require('child_process').exec
var chalk = require('chalk')
var path = require('path')

// opts.root
// opts.jquery
// opts.font-awesome
module.exports = function (opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  opts = opts || {}
  cb = cb || function () {}

  var root = opts.root || process.cwd()

  console.log(chalk.yellow('Installing packages'))

  var commands = [
    'npm install --save bleh',
    'npm install --save browserify',
    'npm install --save less',
    'npm install --save express',
    'npm install --save handlebars',
    'npm install --save-dev ava idiot nodemon'
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
    var file = path.join(root, '/package.json')
    var orig = require(file)
    var add = require('./files/package.json')
    var data = JSON.stringify(merge(orig, add, orig), null, 2)
    fs.writeFileSync(file, data)

    console.log(chalk.yellow('Creating website files'))
    var source = path.join(__dirname, '/files/')
    fs.copySync(source, root, {
      filter: function (file) {
        if (path.basename(file) === 'package.json') {
          return false
        }
        var dest = file.replace(source, '')
        if (fs.existsSync(dest)) {
          console.log(chalk.magenta('skip ' + dest))
          return false
        }
        return true
      }
    })
    var filename = path.join(root, '/layouts/website/website.node.js')
    var lines = fs.readFileSync(filename, 'utf8').split('\n')
    var addLine = function (line) {
      if (lines.indexOf(line) === -1) {
        lines.splice(1, 0, line)
      }
    }
    if (opts.jquery) {
      console.log(chalk.yellow('Adding jquery cdn to the website layout'))
      addLine("  $.js.push('//code.jquery.com/jquery-2.1.4.min.js')")
    }
    if (opts['fontAwesome']) {
      console.log(chalk.yellow('Adding font-awesome cdn to the website layout'))
      addLine("  $.css.push('//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css')")
    }
    fs.writeFileSync(filename, lines.join('\n'))

    console.log(chalk.cyan('bleh:init done'))
    console.log('Type ' + chalk.inverse('npm run dev') + ' to run your app.')
  })

}
