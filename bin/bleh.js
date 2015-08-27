#!/usr/bin/env node

var program = require('commander')
var package = require('../package.json')
var chalk = require('chalk')
var merge = require('deepmerge')

program.version(package.version)

var opts = {}

opts.build = program.command('build')
  .option('-v --verbose')
  .description('build the dist files')
  .action(function () {
    var build = require('../lib/build')
    build(merge(opts.build, {
      cli: true
    }))
  })

opts.init = program.command('init')
  .option('--jquery', 'add jquery cdn to website layout')
  .option('--font-awesome', 'add font-awesome cdn to website layout')
  .description('initialize a new web app')
  .action(function () {
    var init = require('../lib/init')
    init(opts.init)
  })

opts.page = program.command('page <name>')
  .description('create a blank page')
  .action(function (name) {
    var page = require('../lib/page')
    page(merge(opts.page, {
      name: name
    }))
  })

program.command('*')
  .description('')
  .action(function (cmd) {
    console.log(chalk.red("\nInvalid command 'bleh %s'"), cmd)
    program.help()
  })

program.parse(process.argv)
