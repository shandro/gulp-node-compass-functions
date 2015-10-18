'use strict';


/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var url = require('url');
var q = require('q');


/**
 * Urls functions group prototype.
 *
 * @private
 */

var _urls = exports = module.exports = {};


/**
 * Stylesheet URL
 *
 * This function takes a stylesheet file name
 * and returns back URL for it.
 *
 * @param {string} filePath Path to the stylesheet file;
 * @param {bool} onlyPath flag to export only URL string or CSS url(...);
 * @param {string, bool} cacheBuster appends custom string or last file modification timestamp (if bool) to prevent caching;
 * @param {function} done callback function;
 * @return {string}
 * @private
 */

_urls.stylesheetUrl = function stylesheetUrl() {

  // Shared between submodules data.
  var types = _urls.types;
  var error = _urls.error;

  // Arguments passed in to Sass function.
  var args = Array.prototype.slice.call(arguments);

  // Last argument is a callback function.
  var done = args.pop();
  var filePath = args[0];
  var onlyPath = (typeof args[1] == 'undefined') ? types.boolean(false) : args[1];
  var cacheBuster = (typeof args[2] == 'undefined') ? types.boolean(false) : args[2];

  // Throw an error if filePath is not a string.
  if (typeof filePath.getValue() !== 'string') {
    done(types.null());
    return error('Warning: Required parameter $filePath is incorrect.');
  }

  // Get file URL using `getUrl()` helper function.
  getUrl(filePath, onlyPath, cacheBuster, 'css')

    // Return file URL if promise resolved.
    .then(function(fileUrl){
      done(types.string(fileUrl));

    // Return NULL (or output if specified) and throw an error if promise rejected.
    }, function(err){
      done(err.output ? types.string(err.output) : types.null());
      return error(err.message);
    });

};


/**
 * Font URL
 *
 * This function takes a font file name
 * and returns back URL for it.
 *
 * @param {string} filePath Path to the font file;
 * @param {bool} onlyPath flag to export only URL string or CSS url(...);
 * @param {string, bool} cacheBuster append custom string or last file modification timestamp (if bool) to prevent caching;
 * @param {function} done callback function;
 * @return {string}
 * @private
 */

_urls.fontUrl = function fontUrl() {

  // Shared between submodules data.
  var types = _urls.types;
  var error = _urls.error;

  // Arguments passed in to Sass function.
  var args = Array.prototype.slice.call(arguments);

  // Last argument is a callback function.
  var done = args.pop();
  var filePath = args[0];
  var onlyPath = (typeof args[1] == 'undefined') ? types.boolean(false) : args[1];
  var cacheBuster = (typeof args[2] == 'undefined') ? types.boolean(false) : args[2];

  // Throw an error if filePath is not a string.
  if (typeof filePath.getValue() !== 'string') {
    done(types.null());
    return error('Warning: Required parameter $filePath is incorrect.');
  }

  // Get file URL using `getUrl()` helper function.
  getUrl(filePath, onlyPath, cacheBuster, 'fonts')

    // Return file URL if promise resolved.
    .then(function(fileUrl){
      done(types.string(fileUrl));

      // Return NULL (or output if specified) and throw an error if promise rejected.
    }, function(err){
      done(err.output ? types.string(err.output) : types.null());
      return error(err.message);
    });
};


/**
 * Image URL
 *
 * This function takes an image file name
 * and returns back URL for it.
 *
 * @param {string} filePath Path to the image file;
 * @param {bool} onlyPath flag to export only URL string or CSS url(...);
 * @param {string, bool} cacheBuster append custom string or last file modification timestamp (if bool) to prevent caching;
 * @param {function} done callback function;
 * @return {string}
 * @private
 */

_urls.imageUrl = function imageUrl() {

  // Shared between submodules data.
  var types = _urls.types;
  var error = _urls.error;

  // Arguments passed in to Sass function.
  var args = Array.prototype.slice.call(arguments);

  // Last argument is a callback function.
  var done = args.pop();
  var filePath = args[0];
  var onlyPath = (typeof args[1] == 'undefined') ? types.boolean(false) : args[1];
  var cacheBuster = (typeof args[2] == 'undefined') ? types.boolean(false) : args[2];

  // Throw an error if filePath is not a string.
  if (typeof filePath.getValue() !== 'string') {
    done(types.null());
    return error('Warning: Required parameter $filePath is incorrect.');
  }
  // Get file URL using `getUrl()` helper function.
  getUrl(filePath, onlyPath, cacheBuster, 'images')

    // Return file URL if promise resolved.
    .then(function(fileUrl){
      done(types.string(fileUrl));

    // Return NULL (or output if specified) and throw an error if promise rejected.
    }, function(err){
      done(err.output ? types.string(err.output) : types.null());
      return error(err.message);
    });
};


/**
 * Get URL
 *
 * Helper function takes a file name
 * and returns back URL for it.
 *
 * @param {string} filePath Path to the file;
 * @param {bool} onlyPath flag to export only URL string or CSS url(...);
 * @param {string, bool} cacheBuster append custom string or last file modification timestamp (if bool) to prevent caching;
 * @param {string} assetType asset type name (css, fonts or images);
 * @return {promise}
 * @private
 */

function getUrl(filePath, onlyPath, cacheBuster, assetType) {

  // Get to the string value of the literal.
  filePath = filePath.getValue();
  cacheBuster = cacheBuster.getValue();
  onlyPath = onlyPath.getValue();

  // Initialize the promise.
  var defer = q.defer();

  // Shared between submodules data.
  var options = _urls.options;

  // Check if asset path should be relative to the CSS directory.
  var relativeAssets = options.relativeAssets;

  // Get project path value.
  var projectPath = options.projectPath;

  // Get CSS path value.
  var cssPath = options.cssPath;


  // Asset-specific options property names.
  var asset = {
    path: assetType + 'Path',
    dir: assetType + 'Dir',
    httpPath: 'http' + assetType[0].toUpperCase() + assetType.substr(1) + 'Path'
  };

  // Deal with root relative urls like normal if they start with `[assetType]Path`.
  var escapeExpression = options[asset.httpPath].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  var escapedAssetHttpPath = filePath.match(escapeExpression +'/(.*)');
  if(escapedAssetHttpPath){
    filePath = escapedAssetHttpPath[1];
  }

  // Parse input file path.
  var file = path.parse(filePath);

  // Set root directory as a start point to calculate relative path:
  // if `relativeAssets` option is enabled - use `cssPath`, otherwise - `projectPath`.
  var rootPath = relativeAssets ? cssPath : projectPath;

  // Set asset directory:
  // If input file path is absolute - use `projectPath`, otherwise - options `[asset]Path`.
  var assetDir = path.isAbsolute(file.dir) ? projectPath : options[asset.path];

  // Get real path to the object.
  var realPath = path.format({
    root : rootPath,
    dir : path.join(assetDir, file.dir),
    base : file.base
  });

  // If input file path is absolute - use it, otherwise - calculate relative.
  var assetPath = path.isAbsolute(file.dir) ? filePath : path.relative(rootPath, realPath);

  // If cache buster is defined.
  if (cacheBuster) {

    // Parse asset URL.
    var fileUrl = url.parse(assetPath);

    // Save existing URL query params as cache buster value.
    var cacheBusterString = fileUrl.search || '';

    // Define query params separator depending on existing value.
    var cacheBusterSeparator = cacheBusterString.indexOf('?') >= 0 ? '&' : '?';

    // If `cacheBuster` argument is a string - append it to the file path.
    if (typeof cacheBuster == 'string') {
      cacheBusterString += cacheBusterSeparator + cacheBuster;

    // Otherwise - append to the file path last file modification timestamp.
    } else {

      // Get real file path without hash and query params.
      realPath = url.parse(realPath).pathname;

      // Get file name without hash and query params.
      var fileName = url.parse(file.base).pathname;

      try {

        // Get file stats.
        var fileStat = fs.statSync(realPath);

        // Get last file modification timestamp.
        cacheBusterString += cacheBusterPrefix + new Date(fileStat.mtime).getTime();

      } catch (eror) {

        // Throw an error if target file wasn't found.
        if (eror.code === 'ENOENT') {
          defer.reject({ message: 'WARNING: '+ fileName +' was not found (or cannot be read) in '+ realPath });
        }
      }
    }

    // Create new asset URL with updated query params.
    var newUrl = url.format({
      pathname: fileUrl.pathname,
      search: cacheBusterString,
      hash: fileUrl.hash
    });

    // Resolve the promise with Asset URL and cache buster.
    defer.resolve(onlyPath ? newUrl : 'url("' + newUrl + '")');
  }else{

    // Resolve the promise with Asset URL.
    defer.resolve(onlyPath ? assetPath : 'url("' + assetPath + '")');
  }

  // Return the promise.
  return defer.promise
}