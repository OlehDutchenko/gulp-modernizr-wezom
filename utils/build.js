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
 * @param {Function} [resolve]
 * @param {Function} [reject]
 * @sourceCode
 */
function build (config = {}, resolve, reject) {
	let {
		tests = [],
		excludeTests = [],
		classPrefix = '',
		options = [],
		minify,
		metadata,
		customMetadata
	} = lodash.merge({}, config);

	resolve = defaultCb(resolve);
	reject = defaultCb(reject);

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
			'feature-detects': featuresDetects
		}, resolve);
	} catch (err) {
		reject(err);
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = build;
