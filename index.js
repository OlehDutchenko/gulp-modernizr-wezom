'use strict';

/**
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const through2 = require('through2');
const notSupportedFile = require('gulp-not-supported-file');
const gutil = require('gulp-util');

// data
const pkg = require('./package.json');

// utils
const buildModernizr = require('./utils/build');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Plugin error
 * @param {string|Error} error
 * @param {Object} [errorOptions]
 * @return {PluginError}
 */
function pluginError (error, errorOptions) {
	return new gutil.PluginError(`${pkg.name}@${pkg.version}`, error, errorOptions);
}

// buildModernizr({
// 	'tests': [
// 		'android',
// 		'cookies',
// 		'ambientlight',
// 		'ellipsis'
// 	],
// 	'excludeTests': [
// 		'ellipsis'
// 	],
// 	customTests: './custom-feature-detects/'
// });

// ----------------------------------------
// Public
// ----------------------------------------

function gulpModernizrWezom (options) {
	function readBuffer (file, enc, cb) {
		return cb(null);
	}

	function afterRead (cb) {
		cb();
	}
	return through2.obj(readBuffer, afterRead);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpModernizrWezom;
