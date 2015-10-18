'use strict';

/**
 * Module dependencies.
 */

var mergeDescriptors = require('merge-descriptors');
var _urls = require('./functions/urls');
var _imageDimensions = require('./functions/image-dimensions');
var _fontFiles = require('./functions/font-files');


/**
 * Functions prototype.
 *
 *   - pass shared data (options, Sass types,
 *     error logger) to each functions group.
 *
 * @private
 */

var functions = exports = module.exports = function(shared){
  if (shared) {
    mergeDescriptors(_urls, shared, false);
    mergeDescriptors(_imageDimensions, shared, false);
    mergeDescriptors(_fontFiles, shared, false);
  }
};


/**
 * COMPASS-FUNCTIONS:
 * - Configuration
 * - Selectors
 * - Enumerate
 * + Urls
 * - Display
 * - InlineImage
 * + ImageSize
 * - GradientSupport
 * + FontFiles
 * - Files
 * - Constants
 * - Lists
 * - Colors
 * - Math
 * - CrossBrowserSupport
 * - Env
 */

/**
 * URLs
 * @private
 */

functions['stylesheet-url'] = _urls.stylesheetUrl;
functions['font-url'] = _urls.fontUrl;
functions['image-url'] = _urls.imageUrl;

/**
 * Image Dimensions
 * @private
 */

functions['image-width'] = _imageDimensions.imageWidth;
functions['image-height'] = _imageDimensions.imageHeight;

/**
 * Font Files
 */

functions['font-files'] = _fontFiles.fontFiles;
