var util = require('util');

var FecliBase = require("./fecli-base");

function Assets(attributes, baseDir) {
  Assets.super_.call(this, attributes, baseDir);
}

Assets.JSON_FILE_NAME = "assets.json";

util.inherits(Assets, FecliBase);

module.exports = Assets;
