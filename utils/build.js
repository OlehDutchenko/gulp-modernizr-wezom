'use strict';

/**
 * Build modernizr file
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const path = require('path');
const lodash = require('lodash');
const modernizr = require('modernizr');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Get relative path from modernizr folder to cwd;
 * @return {string}
 * @private
 */
function getRelativePath () {
	let pkg = require.resolve('modernizr/package.json');
	let relative = path.relative(pkg, process.cwd());
	return relative.replace(/\\/g, '/') + '/';
}

/**
 * @param data
 * @private
 */
function defaultCb (fn) {
	if (typeof fn !== 'function') {
		fn = function (data) {
			console.log(data);
		};
	}
	return fn;
}

/**
 * @const {string}
 * @private
 */
const relativePath = getRelativePath();

function getTest (featuresDetects, filteredTest, data, isCustomTest) {
	let index = filteredTest.indexOf(data.property);
	if (~index) {
		let amdPath = data.amdPath;
		if (isCustomTest) {
			amdPath = path.join(relativePath, amdPath).replace(/\\/g, '/');
		}
		featuresDetects.push(amdPath);
		filteredTest.splice(index, 1);
	}
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {Object} [config={}] - build options
 * @param {Array.<string>} [config.tests=[]] - List of required tests
 * @param {Array.<string>} [config.excludeTests=[]] - A list of test cases that need to be excluded if they are found
 * @param {string} [config.classPrefix=''] - A string that is added before each CSS class
 * @param {Array.<string>} [config.options=[]] - Modernizr build options
 * @param {boolean} [config.minify=false] - Minimise resulting file
 * @param {boolean} [config.enableJSClass=true] - Whether or not to update `.no-js` to `.js` on the root element
 * @param {boolean} [config.enableClasses=true] - Whether or not Modernizr should add its CSS classes at all
 * @param {Array.<Object>} [config.metadata=[]] - Metadata of own Modernizr tests
 * @param {Array.<Object>} [config.customMetadata=[]] - Metadata of user custom Modernizr tests
 * @param {Function} [done] - Success callback
 * @param {Function} [fail] - Error callback
 * @sourceCode
 */
function build (config = {}, done, fail) {
	let {
		tests = [],
		excludeTests = [],
		classPrefix = '',
		options = [],
		minify = false,
		enableJSClass = true,
		enableClasses = true,
		metadata = [],
		customMetadata = []
	} = lodash.merge({}, config);

	done = defaultCb(done);
	fail = defaultCb(fail);

	let featuresDetects = [];
	let filteredTest = tests.filter(test => !~excludeTests.indexOf(test));

	customMetadata.forEach(data => getTest(featuresDetects, filteredTest, data, true));
	if (filteredTest.length) {
		for (let i = 0; i < metadata.length; i++) {
			getTest(featuresDetects, filteredTest, metadata[i]);
			if (!filteredTest.length) {
				break;
			}
		}
	}

	try {
		modernizr.build({
			classPrefix,
			options,
			minify,
			enableJSClass,
			enableClasses,
			'feature-detects': featuresDetects
		}, done);
	} catch (err) {
		fail(err);
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = build;
