'use strict';

/**
 * Get custom tests path as property
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const fs = require('fs');
const path = require('path');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Check custom tests path
 * @param {string} customPath
 * @returns {string|null} customPath
 * @sourceCode
 */
function getCustomTestsPath (customPath) {
	if (typeof customPath !== 'string') {
		return null;
	}

	let absPath = path.join(process.cwd(), customPath);
	if (fs.existsSync(absPath) && fs.statSync(absPath).isDirectory()) {
		return customPath;
	}
	return null;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = getCustomTestsPath;
