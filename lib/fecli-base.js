var path = require('path');
var fs = require('fs');

var fileUtil = require('./file-util');
var logger = require('./logger');

function FecliBase(attributes, baseDir) {
  if (attributes) {
    this.attributes = attributes;
  } else {
    this.attributes = {};
  }
  this.baseDir = (baseDir) ? baseDir : null;
}

FecliBase.prototype.setBaseDir = function(baseDir) {
  this.baseDir = baseDir;
};

FecliBase.prototype.getJSONPath = function() {
  if (!this.baseDir) {
    logger.log("warn", "no base directory set");
    return null;
  }
  return path.join(this.baseDir, this.constructor.JSON_FILE_NAME);
};

FecliBase.prototype.loadFromFile = function() {
  if (this.JSONFileExists()){
    this.attributes = fileUtil.loadConfigItem(this.getJSONPath()) || {};
    return this.attributes;
  } else {
    return false;
  }
};

FecliBase.prototype.JSONFileExists = function() {
  return fs.existsSync(this.getJSONPath());
};

FecliBase.prototype.getFilePath = function(filename){
  if (!this.baseDir) {
    logger.log("warn", "no base directory set");
    return null;
  }
  return path.join(this.baseDir, filename);
};

module.exports = FecliBase;
