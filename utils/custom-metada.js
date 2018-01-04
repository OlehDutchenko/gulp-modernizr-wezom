'use strict';

/**
 * Create custom metadata method
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.1.4
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const modernizr = require('modernizr');
const fs = require('fs');
const path = require('path');
const file = require('file');
const Remarkable = require('remarkable');
const polyfills = require('modernizr/lib/polyfills.json');

// ----------------------------------------
// Private
// ----------------------------------------

const dirName = path.dirname(require.resolve('modernizr/lib/metadata'));

/**
 * @const {Function}
 * @private
 */
const metadata = new Function('Remarkable, file, fs, polyfills, viewRoot, __dirname', 'return ' + modernizr.metadata); // eslint-disable-line no-new-func

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {string} viewRoot
 * @return {Array.<Object>}
 * @sourceCode
 */
function getCustomMetadata (viewRoot) {
	let result = metadata(Remarkable, file, fs, polyfills, viewRoot, dirName)();
	return result;
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = getCustomMetadata;
