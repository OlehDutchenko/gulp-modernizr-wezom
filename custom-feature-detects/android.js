/*!
{
  "name": "android",
  "property": "android"
}
!*/

/**
 * Набор пользовательских тестов для `modernizr.js`.
 * @namespace modernizrTests
*/


define(['Modernizr'], function(Modernizr) {
/**
 * Определение **android**
 * @memberOf modernizrTests
 * @name android
 * @sourceCode |+4
*/
	Modernizr.addTest('android', (navigator.userAgent.toLowerCase().indexOf('android') >= 0));
});
