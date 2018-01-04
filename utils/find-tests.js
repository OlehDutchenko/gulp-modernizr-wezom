'use strict';

/**
 * Find test in files content
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.1.4
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
	let suffix = (extname === '.css') ? '(((?![\\{|\\}]).|(\\r)?\\n)*)\\{' : '';

	testList.forEach(test => {
		let pattern = new RegExp(pref + test + '\\b[^-]' + suffix, 'g');
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
