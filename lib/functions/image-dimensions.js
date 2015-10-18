'use strict';


/**
 * Module dependencies.
 */

var path = require('path');
var q = require('q');
var imageSize = require('image-size');
var _urls = require('./urls');


/**
 * Image Dimensions functions group prototype.
 *
 * @private
 */

var _imageDimensions = exports = module.exports = {};


/**
 * Image Width
 *
 * Takes an image file path and returns
 * back width dimension for it.
 *
 * @param {string} imageFile Path to the image file;
 * @param {function} done callback function;
 * @return {string}
 * @private
 */

_imageDimensions.imageWidth = function imageWidth() {

  // Shared between submodules data.
  var types = _imageDimensions.types;
  var error = _imageDimensions.error;

  // Arguments passed in to Sass function.
  var args = Array.prototype.slice.call(arguments);

  // Last argument is a callback function.
  var done = args.pop();
  var imageFile = args[0];

  // Throw an error if imageFile is not a string.
  if (typeof imageFile.getValue() !== 'string') {
    done(types.null());
    return error('Warning: Required parameter $filePath is incorrect.');
  }

  imageDimensions(imageFile)
    
    // Return file width if promise resolved.
    .then(function (imageData) {
      done(types.number(imageData.width, 'px'));
    
    // Return NULL and throw an error if promise rejected.
    }, function (errorMessage) {
      error(errorMessage);
      done(types.null);
    });
};


/**
 * Image Height
 *
 * Takes an image file path and returns
 * back height dimension for it.
 *
 * @param {string} imageFile Path to the image file;
 * @param {function} done callback function;
 * @return {string}
 * @private
 */

_imageDimensions.imageHeight = function imageHeight() {

  // Shared between submodules data.
  var types = _imageDimensions.types;
  var error = _imageDimensions.error;

  // Arguments passed in to Sass function.
  var args = Array.prototype.slice.call(arguments);

  // Last argument is a callback function.
  var done = args.pop();
  var imageFile = args[0];

  // Throw an error if imageFile is not a string.
  if (typeof imageFile.getValue() !== 'string') {
    done(types.null());
    return error('Warning: Required parameter $filePath is incorrect.');
  }

  imageDimensions(imageFile)

    // Return file height if promise resolved.
    .then(function (imageData) {
      done(types.number(imageData.height, 'px'));

      // Return NULL and throw an error if promise rejected.
    }, function (errorMessage) {
      error(errorMessage);
      done(types.null);
    });
};


/**
 * Image Dimensions
 *
 * Helper function.
 * Takes an image file path and returns
 * a promise with dimensions object for it.
 *
 * @param {string} imageFile Path to the image file;
 * @return {promise}
 * @private
 */

function imageDimensions(imageFile) {

  // Initialize the promise.
  var defer = q.defer();

  // Shared between submodules data.
  var options = _imageDimensions.options;
  var types = _imageDimensions.types;

  // Allowed image file types.
  var imageTypes = ['png', 'jpg', 'jpeg', 'gif'];

  // Throw error if file extensions is not in the imageTypes array.
  var fileExtension = path.extname(imageFile.getValue()).substring(1);
  if(imageTypes.indexOf(fileExtension) < 0){
    defer.reject('Warning: Unrecognized file type: "'+ fileExtension +'"');
  }

  // Get image URL.
  _urls.imageUrl(imageFile, types.boolean(true), types.boolean(false), function (image) {

    // Get real path to the image.
    var filePath = image.getValue();
    var realPath = path.resolve(options.imagesPath, filePath);

    // Get image size.
    imageSize(realPath, function (err, dimensions) {

      // Reject promise if error.
      if (err) {
        switch (err.code) {

          // File not found
          case 'ENOENT':
            defer.reject('WARNING: ' + path.basename(filePath) + ' was not found (or cannot be read) in ' + realPath);
            break;

          // ToDo: Catch more error cases
          // Everything else
          default: defer.reject(err.code)
        }
      } else {

        // Resolve promise with image dimensions object
        defer.resolve(dimensions)
      }
    });
  });

  // Return the promise.
  return defer.promise
}