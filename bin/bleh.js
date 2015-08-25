#!/usr/bin/env node

var program = require('commander')
var package = require('../package.json')
var chalk = require('chalk')
var merge = require('deepmerge')
var build = require('../lib/build')
var init = require('../lib/init')

program.version(package.version)

var opts = {}

opts.build = program.command('build')
  .option('-v --verbose')
  .description('build the dist files')
  .action(function () {
    build(merge(opts.build, {
      cli: true
    }))
  })

opts.init = program.command('init')
  .option('--jquery')
  .option('--font-awesome')
  .description('initialize a new web app')
  .action(function () {
    init(opts.init)
  })

program.command('*')
  .description('')
  .action(function (cmd) {
    console.log(chalk.red("\nInvalid command 'bleh %s'"), cmd)
    program.help()
  })

program.parse(process.argv)
