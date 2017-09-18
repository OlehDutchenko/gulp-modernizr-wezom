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
const createBanner = require('./utils/create-banner');

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

/**
 * Core plugin method
 * @param {Object} [config={}] - plugin config
 * @param {Array.<string>} [config.tests=[]] - List of required tests
 * @param {string} [config.customTests] - Relative path from process.cwd() to folder with your custom tests
 * @param {Array.<string>} [config.excludeTests=[]] - A list of test cases that need to be excluded if they are found
 * @param {string} [config.classPrefix=''] - A string that is added before each CSS class
 * @param {Array.<string>} [config.options=[]] - Modernizr build options
 * @param {boolean} [config.minify=false] - Minimise resulting file
 * @param {boolean} [config.enableJSClass=true] - Whether or not to update `.no-js` to `.js` on the root element
 * @param {boolean} [config.enableClasses=true] - Whether or not Modernizr should add its CSS classes at all
 * @return {DestroyableTransform}
 */
function gulpModernizrWezom (config = {}) {
	let {
		tests = [],
		customTests,
		excludeTests = [],
		classPrefix = '',
		options = [],
		minify = false,
		enableJSClass = true,
		enableClasses = true
	} = lodash.merge({}, config);

	let testList = [];
	let foundedTests = [];
	let metadata = gulpModernizrWezom.getMetadata();
	let customMetadata = gulpModernizrWezom.getCustomMetadata(customTests);
	metadata.concat(customMetadata).forEach(data => testList.push(data.property));

	function readBuffer (file, enc, cb) {
		let notSupported = notSupportedFile(file, pluginError, {silent: true});
		if (Array.isArray(notSupported)) {
			return cb(null);
		}
		findTests(file, testList, foundedTests, classPrefix);
		return cb(null);
	}

	function afterRead (cb) {
		let entryTests = tests.concat([]);
		let entryExcludeTests = excludeTests.concat([]);

		foundedTests.forEach(founded => {
			founded.tests.forEach(test => {
				if (!~tests.indexOf(test)) {
					tests.push(test);
				}
			});
		});

		buildModernizr({
			tests,
			excludeTests,
			classPrefix,
			options,
			minify,
			enableJSClass,
			enableClasses,
			metadata,
			customMetadata
		}, (result) => {
			let jsFile = new Vinyl({
				path: 'modernizr.js',
				contents: Buffer.from(result)
			});
			createBanner(entryTests, foundedTests, entryExcludeTests, jsFile);
			this.push(jsFile);
			cb();
		}, (err) => cb(err));
	}

	return through2.obj(readBuffer, afterRead);
}

/**
 * Plugin name
 * @type {string}
 */
gulpModernizrWezom.pluginName = pkg.name;

/**
 * Get metadata of own Modernizr tests
 * @type {Function}
 * @returns {Array.<Object>}
 */
gulpModernizrWezom.getMetadata = function () {
	return parseProps(modernizr.metadata());
};

/**
 * Get metadata of user custom Modernizr tests
 * @type {Function}
 * @param {string} [customTests] - Relative path from process.cwd() to folder with your custom tests
 * @returns {Array.<Object>}
 */
gulpModernizrWezom.getCustomMetadata = function (customTests) {
	customTests = getCustomTestsPath(customTests);
	return customTests ? parseProps(getCustomMetadata(customTests)) : [];
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpModernizrWezom;
