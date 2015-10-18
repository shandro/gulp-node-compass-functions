'use strict';

/**
 * Module dependencies.
 */
//var gutil = require('gulp-util');

exports = module.exports = function logError(error) {
  console.log(error);
  //var message = new gutil.PluginError('compass-functions', error).toString();
  process.stderr.write(message + '\n');
  this.emit('end');
};