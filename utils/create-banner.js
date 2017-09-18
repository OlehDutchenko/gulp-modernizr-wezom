'use strict';

/**
 * Create info banner
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const chalk = require('chalk');
const columns = require('cli-columns');

// data
const pkg = require('../package.json');

// ----------------------------------------
// Public
// ----------------------------------------

function createBanner (entryTests, entryFoundedTests, entryExcludeTests, jsFile) {
	let start = chalk.gray('>>');
	let foundedTests = [];
	let num = 1;
	entryFoundedTests.forEach(founded => foundedTests.push(`${start + chalk.gray(num++)} ${founded.path}`, chalk.green(columns(founded.tests))));
	entryTests = entryTests.length ? chalk.green(columns(entryTests)) : chalk.blue('no tests');
	entryExcludeTests = entryExcludeTests.length ? chalk.green(columns(entryExcludeTests)) : chalk.blue('no excluded tests');

	let msg = [
		'',
		chalk.bold(`${pkg.name}@${pkg.version} result`),
		'',
		chalk.bold(`${start} User required tests:`),
		entryTests
	];

	if (foundedTests.length) {
		msg.push('', chalk.bold(`${start} The tests found in the following files:`), foundedTests.join('\n'));
	}

	msg.push('', chalk.bold(`${start} Excluded tests in all lists:`), entryExcludeTests);

	console.log(msg.join('\n') + '\n');
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createBanner;
