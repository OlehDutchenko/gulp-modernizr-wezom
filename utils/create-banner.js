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
// Private
// ----------------------------------------

// в этой части файла создаються и описываються
// вспомогательные значения и методы, который будут использованы
// внутри вашего основного кода, ради которого создан этот файл
// Также слово приватный - обозначает что эти значения и методы
// не будут доступны за пределами этого файла

// ----------------------------------------
// Public
// ----------------------------------------

function createBanner (entryTests, entryFoundedTests, entryExcludeTests, jsFile) {
	let start = chalk.gray('>>') + ' ';
	let foundedTests = [];
	let num = 1;
	entryFoundedTests.forEach(founded => foundedTests.push(`${start + chalk.gray(num++)} ${founded.path}`, chalk.green(columns(founded.tests))));
	entryTests = entryTests.length ? chalk.green(columns(entryTests)) : chalk.blue('no tests');
	entryExcludeTests = entryExcludeTests.length ? chalk.green(columns(entryExcludeTests)) : chalk.blue('no excluded tests');

	let msg = [
		'',
		`${pkg.name}@${pkg.version} result`,
		'',
		start + 'User required tests:',
		entryTests
	];

	if (foundedTests.length) {
		msg.push('', start + 'The tests found in the following files:', foundedTests.join('\n'));
	}

	msg.push('', start + 'Excluded tests in all lists:', entryExcludeTests);

	console.log(msg.join('\n') + '\n');
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createBanner;
