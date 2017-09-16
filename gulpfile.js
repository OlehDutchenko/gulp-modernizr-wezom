'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');
const del = require('del');

// ----------------------------------------
// Private
// ----------------------------------------

const docsSrc = ['./index.js'];
const docsDest = './api-docs';

const jsdocConfig = {
	source: {
		includePattern: '.+\\.js(docs|x)?$',
		excludePattern: '(^|\\/|\\\\)_'
	},
	tags: {
		allowUnknownTags: true,
		dictionaries: [
			'jsdoc',
			'closure'
		]
	},
	opts: {
		encoding: 'utf8',
		template: './node_modules/jsdoc-simple-theme/',
		destination: docsDest,
		recurse: true,
		debug: false,
		verbose: false
	},
	plugins: [
		'plugins/markdown',
		'./node_modules/jsdoc-export-default-interop/dist/index',
		'./node_modules/jsdoc-ignore-code/index',
		'./node_modules/jsdoc-sourcecode-tag/index'
	],
	markdown: {
		parser: 'gfm',
		hardwrap: true
	},
	templates: {
		cleverLinks: false,
		monospaceLinks: false,
		systemName: 'system API docs',
		default: {
			outputSourceFiles: true,
			layoutFile: './node_modules/jsdoc-simple-theme/tmpl/layout.tmpl'
		}
	}
};

// ----------------------------------------
// Public
// ----------------------------------------

gulp.task('docs', function (done) {
	del.sync(docsDest);
	gulp.src(docsSrc, {buffer: false})
		.pipe(jsdoc(jsdocConfig, function (err) {
			if (err) {
				console.log(err.message);
				return this.emit('end');
			}
			console.log('done');
			done();
		}));
});

gulp.task('docs-watch', gulp.series('docs', function () {
	gulp.watch(docsSrc, gulp.series('docs'));
}));
