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
 * @param {Array.<string>} foundedList
 * @param {string} classPrefix
 * @sourceCode
 */
function findTests (file, testList, foundedList, classPrefix) {
	let content = String(file.contents);
	let extname = file.extname;

	if (!~['.css', '.js'].indexOf(extname)) {
		return;
	}

	let founded = {file: file.path, tests: []};
	let pref = (extname === '.js') ? 'Modernizr\\.' : '\\.(no-)?';

	testList.forEach(test => {
		let pattern = new RegExp(pref + classPrefix + test + '\\b[^-]', 'g');
		console.log(pattern);
		if (pattern.test(content)) {
			founded.tests.push(test);
		}
	});

	if (founded.tests.length) {
		foundedList.push(founded);
	}
	console.log(foundedList);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = findTests;
