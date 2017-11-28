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
    let fullSourceFilePath = path.join(this.configFileDir, sourceFilePath)
    vJS += sourceFileToJS(fullSourceFilePath)
  })
  vJS =
    `/*fecli-injected JavaScript*/\n  ;(function(){\n    ${vJS}\n})();\n/*fecli-injected JavaScript*/`
  return vJS
}

// Read a JS/CSS file and return a browser-executable JavaScript string
function sourceFileToJS (filePath) {
  let fileContents = fs.readFileSync(filePath, 'utf8')
  if (filePath.endsWith('js')) {
    return fileContents
  } else if (filePath.endsWith('css')) {
    return wrapCSS(removeLineBreaks(fileContents))
  }
}

function removeLineBreaks (text) {
  return text.replace(/\r?\n|\r/g, '')
}

function wrapCSS (cssText) {
  return 'style=document.createElement("style");style.type="text/css";' + 
    `style.appendChild(document.createTextNode("${cssText}"));` +
    'document.head.appendChild(style);'
}

module.exports = LocalController
