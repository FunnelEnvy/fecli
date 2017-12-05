/**
 * Module dependencies
 */
var express = require('express')
var ejs = require('ejs')
var path = require('path')
var fs = require('fs')
var open = require('open')
var logger = require('../logger')

const PORT = 8080

module.exports = function (configFilePath) {
  // Start Server
  var app = express()
  app.set('view engine', 'ejs')

  // Read config file
  let configFileDir = path.dirname(configFilePath)
  let options = JSON.parse(fs.readFileSync(
    configFilePath, { encoding: 'utf-8' }))

  // Create handler for inject code
  let injectHandler = generateInjectHandler(options, configFileDir)

  // set the routes
  app.get('/', home)
  app.get('/install.user.js', installUserScript)
  app.get('/inject.js', injectHandler)

  // start the server
  var onStartup = function () {
    console.log('Serving inject.js')
    console.log(`Point your browser to https://localhost:${PORT}`)
    console.log('Ctrl-c to quit')
  }

  return require('https').createServer(getSSLCredentials(), app)
    .listen(PORT, onStartup)
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

function generateInjectHandler (options, configFileDir) {
  // Return a request handler based on options passed
  return function (req, res) {
    var vJS = compileLocalJS()
    // Render JS
    res.set({
      'Content-Type': 'text/javascript'
    })
    res.end(vJS)
    
    function compileLocalJS () {
      let vJS = ''
      // Loop through local source files
      options.files.forEach( (sourceFilePath) => {
        let fullSourceFilePath = path.join(configFileDir, sourceFilePath)
        vJS += sourceFileToJS(fullSourceFilePath)
      })
      if (options.inject) {
        vJS = wrapJSConditional(vJS, options.inject)
      }
      return wrapJS(vJS)
    }
  }
}

/**
 * Route handlers
 */
function installUserScript (req, res) {
  let originalPath = path.join(
    path.dirname(fs.realpathSync(__filename)),
    '../../')
  let installTemplate = fs.readFileSync(
    originalPath + 'templates/install.user.js.ejs', {
      encoding: 'utf-8'
    })
  res.end(String(ejs.render(
    installTemplate, {}
  )))
}

function home (req, res) {
  var originalPath = path.join(
    path.dirname(fs.realpathSync(__filename)),
    '../../')
  this.indexTemplate = fs.readFileSync(
    originalPath + 'templates/index.ejs', {
      encoding: 'utf-8'
    })
  res.end(String(ejs.render(
    indexTemplate, {}
  )))
}

/**
 * Helper functions
 */

// Read a JS/CSS file and return a browser-executable JavaScript string
function sourceFileToJS (filePath) {
  let fileContents = fs.readFileSync(filePath, 'utf8')
  if (filePath.endsWith('js')) {
    return fileContents
  } else if (filePath.endsWith('css')) {
    return wrapCSS(removeLineBreaks(fileContents))
  }
}

// Wrap a JavaScript string in a commented IIFE
function wrapJS (js) {
  return `/*fecli-injected JavaScript*/\n  ;(function(){\n    ${js}\n})();\n/*fecli-injected JavaScript*/`
}

// Wrap a JavaScript string in a polling IIFE called 'fecliPoll'
function wrapJSConditional (js, condition) {
  return `(function fecliPoll () {
    if (!(${condition})) return setTimeout(fecliPoll, 20);
    ${js}
  })();`
}

// Wrap a CSS string in executable JavaScript that appends it to `document`
function wrapCSS (cssText) {
  return 'style=document.createElement("style");style.type="text/css";' + 
    `style.appendChild(document.createTextNode("${cssText}"));` +
    'document.head.appendChild(style);'
}

function removeLineBreaks (text) {
  return text.replace(/\r?\n|\r/g, '')
}
