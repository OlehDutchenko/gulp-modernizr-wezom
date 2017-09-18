'use strict';

/**
 * Find test in files content
 * @module
 */

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {Object} file
 * @param {Array.<string>} testList
 * @param {Array} foundedTests
 * @param {string} classPrefix
 * @sourceCode
 */
function findTests (file, testList, foundedTests, classPrefix) {
	let extname = file.extname;
	if (!~['.css', '.js'].indexOf(extname)) {
		return;
	}

	let founded = [];
	let content = String(file.contents);
	let cssPref = (typeof classPrefix === 'string' && classPrefix) ? classPrefix : '';
	let pref = (extname === '.js') ? 'Modernizr\\.' : `\\.${cssPref}(no-)?`;

	testList.forEach(test => {
		let pattern = new RegExp(pref + test + '\\b[^-]', 'g');
		if (pattern.test(content)) {
			founded.push(test);
		}
	});

	if (founded.length) {
		foundedTests.push({
			path: file.path,
			tests: founded
		});
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = findTests;
