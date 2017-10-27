var Variation = require("../variation")
var path = require('path')
var fs = require('fs')

function writeCompiledHTML(varPath) {
  var variation = new Variation({}, varPath)
  variation.loadFromFile()
  let outputHTML = `<style>\n${variation.getCSS()}\n</style>\n` +
                   `<script>\n${variation.getJS()}</script>`
  fs.writeFile(path.resolve(varPath, 'compiled.html'), outputHTML, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  }); 
}

module.exports = function(variationPath) {
  writeCompiledHTML(variationPath)
};
