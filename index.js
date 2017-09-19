'use strict';

/**
 * Plugin index
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
const chalk = require('chalk');

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
 * @returns {PluginError}
 * @private
 */
function pluginError (error, errorOptions) {
	return new gutil.PluginError(`${pkg.name}@${pkg.version}`, error, errorOptions);
}

/**
 * @param {Array.<Object>} list
 * @returns {Array}
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
 * @returns {DestroyableTransform}
 */
function gulpModernizrWezom (config = {}) {
	let {
		tests = [],
		customTests,
		excludeTests = [],
		classPrefix = '',
		options = [],
		minify = false
	} = lodash.merge({}, config);

	let testList = [];
	let foundedTests = [];
	let metadata = gulpModernizrWezom.getMetadata();
	let customMetadata = gulpModernizrWezom.getCustomMetadata(customTests);
	metadata.concat(customMetadata).forEach(data => testList.push(data.property));

	// read each file
	function readBuffer (file, enc, cb) {
		let notSupported = notSupportedFile(file, pluginError, {
			noUnderscore: false,
			silent: true
		});

		if (Array.isArray(notSupported)) {
			return cb(null);
		}
		findTests(file, testList, foundedTests, classPrefix);
		return cb(null);
	}

	// after reading
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

		let start = chalk.gray.bold('>>');
		let foundedTestsInfo = [];
		let num = 1;

		entryTests = entryTests.length ? chalk.green(entryTests.join(', ')) : chalk.blue('no tests');
		entryExcludeTests = entryExcludeTests.length ? chalk.red(entryExcludeTests.sort().join(', ')) : chalk.blue('no excluded tests');
		foundedTests.forEach(founded => {
			let filePath = chalk.cyan(founded.path);
			let fileNum = `${start} ${chalk.gray.bold(num++)}`;
			let fileTests = chalk.green(founded.tests.sort().join(', '));
			foundedTestsInfo.push('', `${fileNum} ${filePath}`, fileTests);
		});

		let msg = ['', pkg.name + chalk.cyan('#' + pkg.version) + ' result', '', `${start} User required tests:`, entryTests];
		if (foundedTestsInfo.length) {
			msg.push('', `${start} The tests found in the following files:`, foundedTestsInfo.join('\n'));
		}
		msg.push('', `${start} Excluded tests in all lists:`, entryExcludeTests);
		console.log(msg.join('\n'));

		// send to building
		buildModernizr({
			tests,
			excludeTests,
			classPrefix,
			options,
			minify,
			metadata,
			customMetadata
		}, (result) => {
			console.log(chalk.yellow('Done!\n'));
			this.push(new Vinyl({
				path: 'modernizr.js',
				contents: Buffer.from(result)
			}));
			cb();
		}, (err) => {
			console.log(chalk.red('Filed\n'));
			cb(err);
		});
	}

	return through2.obj(readBuffer, afterRead);
}

/**
 * Plugin name
 * @type {string}
 * @member {string} gulpModernizrWezom::pluginName
 */
gulpModernizrWezom.pluginName = pkg.name;

/**
 * Plugin version
 * @type {string}
 * @member {string} gulpModernizrWezom::pluginVersion
 */
gulpModernizrWezom.pluginVersion = pkg.version;

/**
 * Get metadata of own Modernizr tests
 * @type {Function}
 * @returns {Array.<Object>}
 * @method gulpModernizrWezom::getMetadata
 */
gulpModernizrWezom.getMetadata = function () {
	return parseProps(modernizr.metadata());
};

/**
 * Get metadata of user custom Modernizr tests
 * @type {Function}
 * @param {string} [customTests] - Relative path from process.cwd() to folder with your custom tests
 * @returns {Array.<Object>}
 * @method gulpModernizrWezom::getCustomMetadata
 */
gulpModernizrWezom.getCustomMetadata = function (customTests) {
	customTests = getCustomTestsPath(customTests);
	return customTests ? parseProps(getCustomMetadata(customTests)) : [];
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpModernizrWezom;
