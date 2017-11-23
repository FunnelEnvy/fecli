/**
 * Module dependencies
 */
var express = require('express')
var path = require('path')
var fs = require('fs')
var open = require('open')
var logger = require('../logger')

var LocalController = require('../server/controller')

module.exports = function (configFilePath, program) {
  // Start Server
  var app = express()
  var localController

  app.set('view engine', 'ejs')

  // local controller for the requests
  try {
    localController = new LocalController(configFilePath)
  } catch (error) {
    logger.log('error', error.message)
    return
  }

  // set the routes
  app.get('/', localController.installUserScript.bind(localController))
  app.get('/install.user.js', localController.userScript.bind(localController))
  app.get('/inject.js', localController.injectJS.bind(localController))

  // start the server
  var onStartup = function () {
    console.log('Serving inject.js')
    console.log(`Point your browser to https://localhost:${localController.port}`)
    console.log('Ctrl-c to quit')
    if (program.open) {
      open(`https://localhost:${localController.port}`)
    }
  }

  return require('https').createServer(getSSLCredentials(), app)
    .listen(localController.port, onStartup)
    .on('error', handleStartupError)
}

function getSSLCredentials () {
  var originalPath = path.join(
    path.dirname(fs.realpathSync(__filename)),
    '../../')
  var credentials = {
    key: fs.readFileSync(originalPath + 'ssl/server.key', 'utf8'),
    cert: fs.readFileSync(originalPath + 'ssl/server.crt', 'utf8')
  }
  return credentials
}

function handleStartupError (error) {
  if (error.errno === 'EADDRINUSE') {
    logger.log('error', 'Port already in use. Kill the other process or use another port.')
  } else {
    logger.log('error', `Error with local hosting: ${error.message}`)
  }
}
