/**
 * Module dependencies
 */
var express = require('express')
var path = require('path')
var fs = require('fs')

const PORT = 8080

module.exports = function (configFilePath) {
  // Create server
  var app = express()
  app.set('view engine', 'ejs')

  // Import and create handlers
  let controller = require('../controller')
  let home = controller.home
  let installUserScript = controller.installUserScript
  let generateInjectHandler = controller.generateInjectHandler
  let injectHandler
  // This step reads the config file
  try {
    injectHandler = generateInjectHandler(configFilePath)
  } catch (e) {
    console.log(`Error creating handler from config file:\n${e}`)
    console.log('fecli will exit ...')
    return
  }

  // set the routes
  app.get('/', home)
  app.get('/install.user.js', installUserScript)
  app.get('/inject.js', injectHandler)

  return require('https').createServer(getSSLCredentials(), app)
    .listen(PORT, onStartup)
    .on('error', handleStartupError)
}

/**
 * Helper functions
 */

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
    console.log('error', 'Port already in use. Kill the other process or use another port.')
  } else {
    console.log('error', `Error with local hosting: ${error.message}`)
  }
}

function onStartup () {
  console.log('Serving inject.js')
  console.log(`Point your browser to https://localhost:${PORT}`)
  console.log('Ctrl-c to quit')
}

