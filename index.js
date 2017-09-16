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
const lodash = require('lodash');
const modernizr = require('modernizr');
const Vinyl = require('vinyl');

// data
const pkg = require('./package.json');

// utils
const buildModernizr = require('./utils/build');
const getCustomTestsPath = require('./utils/custom-tests-path');
const getCustomMetadata = require('./utils/custom-metada');
const findTests = require('./utils/find-tests');

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

/**
 * @param {Array} list
 * @private
 */
function parseProps (list) {
	let arr = [];
	list.forEach(data => {
		let props = data.property;
		if (Array.isArray(props)) {
			props.forEach(property => {
				arr.push(lodash.merge({}, data, {property}));
			});
		} else {
			arr.push(data);
		}
	});

	return arr;
}

// ----------------------------------------
// Public
// ----------------------------------------

function gulpModernizrWezom (config) {
	let {
		tests = [],
		customTests,
		excludeTests = [],
		classPrefix = '',
		options = [],
		minify
	} = lodash.merge({}, config);

	customTests = getCustomTestsPath(customTests);
	let metadata = parseProps(modernizr.metadata());
	let customMetadata = customTests ? parseProps(getCustomMetadata(customTests)) : [];
	let testList = [];
	let foundedList = [];

	metadata.concat(customMetadata).forEach(data => testList.push(data.property));

	function readBuffer (file, enc, cb) {
		let notSupported = notSupportedFile(file, pluginError, {silent: true});
		if (Array.isArray(notSupported)) {
			return cb(null);
		}
		findTests(file, testList, foundedList, classPrefix);
		return cb(null);
	}

	function afterRead (cb) {
		buildModernizr({
			tests,
			excludeTests,
			classPrefix,
			options,
			minify,
			metadata,
			customMetadata
		}, (result) => {
			this.push(new Vinyl({
				path: 'modernizr.js',
				contents: Buffer.from(result)
			}));
			cb();
		}, (err) => cb(err));
	}

	return through2.obj(readBuffer, afterRead);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpModernizrWezom;
