let path = require('path')
let fs = require('fs')
let ejs = require('ejs')

module.exports = {

  generateInjectHandler: function generateInjectHandler (configFilePath) {
    // Return a request handler based on config file
    let configFileDir = path.dirname(configFilePath)
    let options = JSON.parse(fs.readFileSync(
      configFilePath, { encoding: 'utf-8' }))

    // Create handler for inject code
    return function (req, res) {
      let vJS = compileLocalJS()
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
          try {
            vJS += sourceFileToJS(fullSourceFilePath)
          } catch (e) {
            console.log(`Error reading source file:\n${e}`)
            console.log('fecli will ignore this file and try to continue.')
          }
        })
        if (options.inject) {
          vJS = wrapJSConditional(vJS, options.inject)
        }
        return wrapJS(vJS)
      }
    }
  },

  installUserScript: function installUserScript (req, res) {
    let originalPath = path.join(
      path.dirname(fs.realpathSync(__filename)),
      '../')
    let installTemplate = fs.readFileSync(
      originalPath + 'templates/install.user.js.ejs', {
        encoding: 'utf-8'
      })
    res.end(String(ejs.render(
      installTemplate, {}
    )))
  },

  home: function home (req, res) {
    var originalPath = path.join(
      path.dirname(fs.realpathSync(__filename)),
      '../')
    let indexTemplate = fs.readFileSync(
      originalPath + 'templates/index.ejs', {
        encoding: 'utf-8'
      })
    res.end(String(ejs.render(
      indexTemplate, {}
    )))
  },

  compile: function compile (configFilePath) {
    // Read config file
    let configFileDir = path.dirname(configFilePath)
    let options = JSON.parse(fs.readFileSync(
      configFilePath, { encoding: 'utf-8' }))
    let output = ''
    // Wrap source file contents in style/script tags and add to output string
    options.files.forEach( (sourceFilePath) => {
      let fullSourceFilePath = path.join(configFileDir, sourceFilePath)
      let fileContents = ''
      try {
        fileContents = fs.readFileSync(fullSourceFilePath, 'utf8')
      } catch (e) {
        console.log(`Error reading source file:\n${e}`)
        console.log('fecli will ignore this file and try to continue.')
      }
      if (fullSourceFilePath.endsWith('js')) {
        output += `<script>\n${fileContents}</script>\n`
      } else if (fullSourceFilePath.endsWith('css')) {
        output += `<style>\n${fileContents}</style>\n`
      }
    })
    // Write output to a new file
    let outputFilename = getCompiledFilename(configFilePath)
    fs.writeFileSync(outputFilename, output, (err) => {
      console.log(`Error writing compiled file: ${outputFilename}`)
    })
  }
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
    return wrapCSS(escapeSingleQuotes(removeLineBreaks(fileContents)))
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
  return `var style=document.createElement('style');style.type='text/css';` + 
    `style.appendChild(document.createTextNode('${cssText}'));` +
    `document.head.appendChild(style);\n`
}

// Convert e.g. 'path/to/file.json/' to 'path/to/file.compiled.html'
function getCompiledFilename (path) {
  return path.replace(/\.json$/, '.compiled.html')
}

function escapeSingleQuotes (text) {
  return text.replace(/'/g, "\\'")
}

function removeLineBreaks (text) {
  return text.replace(/\r?\n|\r/g, '')
}
