'use strict';


/**
 * Module dependencies.
 */

var mergeDescriptors = require('merge-descriptors');
var _options = require('./lib/options');
var _prototype = require('./lib/application');
var syncFn = require('./lib/utils/deasync-fn');


/**
 * Expose functions.
 */

exports = module.exports = function (options) {
  var app = {};

  mergeDescriptors(app, _options(options), false);
  mergeDescriptors(app, _prototype, false);

  app.init();

  return syncFn.all(app.functions);
};