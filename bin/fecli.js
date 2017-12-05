#!/usr/bin/env node

var program = require('commander')
var path = require('path')
var fecliPackage = require(path.join(__dirname, '../', 'package.json'))

/* commands */
var loadCommand = function (cmd) {
  var self = this
  return function () {
    require('../lib/commands/' + cmd)
      .apply(self, arguments)
  }
}

program
  .version(fecliPackage.version)
  .description(fecliPackage.description)

program
  .command('host <path>')
  .description('Host experience locally')
  .action(loadCommand('host'))

// Show help if no arguments are passed
if (!process.argv.slice(2).length) {
  program._name = process.argv[1]
  program._name = program._name.substr(program._name.lastIndexOf('/') + 1)
  program.outputHelp()
}

program.parse(process.argv)
