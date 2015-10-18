'use strict';


/**
 * Module dependencies.
 */

var sass = require('node-sass');
var error = require('./utils/error');
var _functions = require('./functions');


/**
 * Application prototype.
 */

var app = exports = module.exports = {};


/**
 * Initialize the application.
 *   - pass options, sass types and error
 *     logger to the functions object
 *
 * @public
 */

app.init = function init(){
  _functions({ options: this.options, types: this.types, error: error });
};


/**
 * Proxy to Sass types.
 *
 * @public
 */

app.types = {
  number: sass.types.Number,
  string: sass.types.String,
  color: sass.types.Color,
  boolean: sass.types.Boolean,
  list: sass.types.List,
  map: sass.types.Map,
  null: sass.types.Null,
  error: sass.types.Error
};


/**
 * Proxy to Functions.
 *
 * @public
 */

app.functions = _functions;