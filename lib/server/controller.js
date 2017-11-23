/**
 * Module dependencies
 */

var ejs = require('ejs')
var path = require('path')
var fs = require('fs')
var logger = require('../logger')

function LocalController () {
  this.port = 8080

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
LocalController.prototype.variationJS = function (req, res) {
  logger.log('debug', process.cwd())
  var vJS = this.compileLocalJS()
  // Render JS
  res.set({
    'Content-Type': 'text/javascript'
  })
  res.end(vJS)
}

LocalController.prototype.compileLocalJS = function () {
  var vJS = `console.log('foo')` // TODO should come from file

  vJS =
    `/*fecli-injected JavaScript*/
    ;(function(){ 
      ${vJS}
    })();\n/*fecli-injected JavaScript*/`
  return vJS
}

module.exports = LocalController
