'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var async = require('async');
var _urls = require('./urls');


/**
 * FontFiles functions group prototype.
 *
 * @private
 */

var _fontFiles = exports = module.exports = {};


/**
 * Font Files
 *
 * This function takes a list of fonts and returns
 * back a list of front urls and font types.
 *
 * @return {string}
 * @private
 */

_fontFiles.fontFiles = function(){

  // Shared between submodules data.
  var error = _fontFiles.error;
  var types = _fontFiles.types;

  // Proxy accepted font files extensions
  // to appropriate font type.
  var fontTypes = {
    woff : 'woff',
    woff2 : 'woff2',
    otf : 'opentype',
    opentype : 'opentype',
    ttf : 'truetype',
    truetype: 'truetype',
    svg: 'svg',
    eot: 'embedded-opentype'
  };

  // Arguments passed in to Sass function.
  var args = Array.prototype.slice.call(arguments);

  // Last argument is a callback function.
  var done = args.pop();

  // Output string.
  var fontFilesStr = '';

  // Loop through arguments (font names) synchronously.
  async.eachSeries(args, function (fontFile, callback) {

    // Get url by font name
    _urls.fontUrl(fontFile, types.boolean(false), types.boolean(false), function (font) {
      // Parse font file extension and detect font type.
      var fileExtension = path.extname(fontFile.getValue()).substring(1);
      var fileType = fontTypes[fileExtension];

      // Throw an error if file extension is unknown.
      if (!fileType) return error('Warning: Could not determine font type for ' + fontFile.getValue());

      // Separate fonts by comma.
      fontFilesStr += fontFilesStr ? ', ' : '';

      // Append font format after url.
      fontFilesStr += font.getValue() + ' ' + 'format("' + fontTypes[fileType] + '")';

      // Code block execution callback.
      callback()
    });

  // Run the callback after loop is executed.
  }, function (err) {

    // Throw error if exist.
    if (err) return error(err);

    // Return output string.
    done(types.string(fontFilesStr));
  });
};