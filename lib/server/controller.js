/**
 * Module dependencies
 */

var ejs = require('ejs')
var path = require('path')
var fs = require('fs')
var logger = require('../logger')

function LocalController (configFilePath) {
  this.port = 8080

  this.configFileDir = path.dirname(configFilePath)

  // load JSON file
  this.config = JSON.parse(fs.readFileSync(
    configFilePath, { encoding: 'utf-8' }))

  // load the templates
  var originalPath = path.join(
    path.dirname(fs.realpathSync(__filename)),
    '../../')

  this.installTemplate = fs.readFileSync(
    originalPath + 'templates/install.user.js.ejs', {
      encoding: 'utf-8'
    })

  this.indexTemplate = fs.readFileSync(
    originalPath + 'templates/index.ejs', {
      encoding: 'utf-8'
    })
}

LocalController.prototype.installUserScript = function (req, res) {
  res.end(String(ejs.render(
    this.indexTemplate, {}
  )))
}

LocalController.prototype.userScript = function (req, res) {
  // Render Userscript
  res.end(String(ejs.render(
    this.installTemplate, {}
  )))
}

// Left here for reference ...
LocalController.prototype.injectJS = function (req, res) {
  logger.log('debug', process.cwd())
  var vJS = this.compileLocalJS()
  // Render JS
  res.set({
    'Content-Type': 'text/javascript'
  })
  res.end(vJS)
}

LocalController.prototype.compileLocalJS = function () {
  let vJS = ''
  // Loop through local source files
  this.config.files.forEach( (sourceFilePath) => {
    let fileContents = fs.readFileSync(
      path.join(this.configFileDir, sourceFilePath)
    )
    vJS += fileContents // TODO treat js and css files appropriately
  })

  vJS =
    `/*fecli-injected JavaScript*/\n  ;(function(){\n    ${vJS}\n})();\n/*fecli-injected JavaScript*/`
  return vJS
}

module.exports = LocalController
