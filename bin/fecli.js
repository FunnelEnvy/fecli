#!/usr/bin/env node

var program = require('commander')
var path = require('path')
var fecliPackage = require(path.join(__dirname, '../', 'package.json'))
var logger = require('../lib/logger.js')

/* commands */
var loadCommand = function (cmd) {
  var self = this
  return function () {
    require('../lib/commands/' + cmd)
      .apply(self, arguments)
  }
}

// default log level
logger.debugLevel = 'info'

function increaseVerbosity (v) {
  logger.debugLevel = 'debug'
}

program
  .version(fecliPackage.version)
  .usage(' - ' + fecliPackage.description)
  .description(fecliPackage.description)
  .option('-v --verbose', 'show debug output', increaseVerbosity)

program
  .command('host <path>')
  .option('-o --open', 'Open the localhost index page')
  .description('Host experience locally')
  .action(loadCommand('host'))

// Show help if no arguments are passed
if (!process.argv.slice(2).length) {
  program._name = process.argv[1]
  program._name = program._name.substr(program._name.lastIndexOf('/') + 1)
  program.outputHelp()
}

program.parse(process.argv)
