/*!
{
  "name": "android",
  "property": "android"
}
!*/

define(['Modernizr'], function(Modernizr) {
	Modernizr.addTest('android', (navigator.userAgent.toLowerCase().indexOf('android') >= 0));
});
