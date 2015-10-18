'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var objectAssign = require('object-assign');

/**
 * Expose options.
 */

module.exports = function(options) {

  var defaultOptions = {
    relativeAssets: true,
    projectPath: './dist',
    httpPath: '/',
    cssDir: 'css',
    imagesDir: 'images',
    fontsDir: 'css/fonts'
    // TODO: Fix case when images and css are in the same directory.
  };

  options = objectAssign({}, options);

  var projectPath = options['projectPath'] || defaultOptions['projectPath'];
  var httpPath = options['httpPath'] || defaultOptions['httpPath'];
  var cssDir = options['cssDir'] || defaultOptions['cssDir'];
  var imagesDir = options['imagesDir'] || defaultOptions['imagesDir'];
  var fontsDir = options['fontsDir'] || defaultOptions['fontsDir'];

  var mergedOptions = objectAssign({}, defaultOptions, {
    projectPath: path.resolve(projectPath),
    cssPath: path.resolve(projectPath, cssDir),
    httpCssPath: path.join(httpPath, cssDir),
    imagesPath: path.resolve(projectPath, imagesDir),
    httpImagesPath: path.join(httpPath, imagesDir),
    fontsPath: path.resolve(projectPath, fontsDir),
    httpFontsPath: path.join(httpPath, fontsDir)
  }, options);

  return {options: mergedOptions}
};