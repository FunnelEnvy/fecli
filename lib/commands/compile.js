/**
 * Module dependencies
 */
var path = require('path')
var fs = require('fs')

module.exports = function (configFilePath) {
  // Import and create handlers
  let controller = require('../controller')
  try {
    controller.compile(configFilePath)
  } catch (e) {
    console.log(`Error creating handler from config file:\n${e}`)
    console.log('fecli will exit ...')
    return
  }
}
