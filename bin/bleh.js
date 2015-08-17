#!/usr/bin/env node

var program = require('commander')
var package = require('../package.json')
var chalk = require('chalk')
var build = require('../lib/build')

program.version(package.version)

var opts = program.command('build')
  .option('-v --verbose')
  .description('create the dist files')
  .action(function () {
    build(opts)
  })

program.command('*')
  .description('')
  .action(function (cmd) {
    console.log(chalk.red("\nInvalid command 'bleh %s'"), cmd)
    program.help()
  })

program.parse(process.argv)
