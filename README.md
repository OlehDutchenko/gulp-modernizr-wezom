# gulp-modernizr-wezom

![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-orange.svg)
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-modernizr-wezom.svg?branch=dev)](https://travis-ci.org/dutchenkoOleg/gulp-modernizr-wezom)

 
:us: English
|
:ru: [Русский язык](https://github.com/dutchenkoOleg/gulp-modernizr-wezom/blob/master/README-RU.md)

> _Gulp plugin for [moderznir](https://github.com/Modernizr/Modernizr), [Wezom studio](http://wezom.com.ua/) version_

[![js happiness style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)




## Table of contents

- [Key Features and Benefits](#key-features-and-benefits)
- [Installation](#installation)
- [Example of use](#example-of-use)
- [Methods and Parameters of the Plugin](#methods-and-parameters-of-the-plugin)
- [Search for tests in `.js` and` .css` files](#Поиск-тестов-в-js-и-css-файлах)
- [Project info](#project-info)


## Key Features and Benefits

- [Modernizr v3 ⇒](https://github.com/Modernizr/Modernizr)
- [Full control over the building your modernizr.js](#configuration)
	- [Explicit indication of tests that are required under any conditions](#tests)
	- [Automatic addition of tests from the incoming files of `gulp` task](#Поиск-тестов-в-js-и-css-файлах)
	- [Explicit specification of options that are required under any conditions](#options)
	- [Automatic addition of `Moderznizr` options, if they are needed for assembly tests](#options)
	- [The ability to add custom tests and rewrite _"native"_ tests "Modernizr"](#customtests)
	- [Ability to exclude unwanted tests](#excludetests)
- [Correct search of tests in `.js` and` .css` files](#Поиск-тестов-в-js-и-css-файлах)

---

## Installation

```shell
npm i --save gulp-modernizr-wezom
# or using yarn cli
yarn add gulp-modernizr-wezom
```

## Example of use

```js
const gulp = require('gulp');
const gulpModernizrWezom = require('gulp-modernizr-wezom');

gulp.task('modernizr', function() {
    let src = [
        './dist/**/*.css', // The incoming files in which the tests will be searched
        './dist/**/*.js', // The incoming files in which the tests will be searched
        '!./dist/**/modernizr.js' // Exception of the file of Modernizr library itself
    ];

    return gulp.src(src)
        .pipe(gulpModernizrWezom({
            tests: [ // add tests forcibly
                'touchevents',
                'ambientlight',
                'adownload',
                'canvasblending'
            ],
            customTests: './my-feature-detects/custom-tests/', // path to the custom tests
            excludeTests: [ // exclude unwanted tests
                'opacity',
                'checked'
            ],
             options: [ // add options to the Modernizr library core
                 'setClasses',
                 'mq'
             ],
             minify: true // minify the final file of modernizr.js
        }))
        .pipe(gulp.dest('./dist/')); // save the resulting file modernizr.js
});
```

## Methods and Parameters of the Plugin

#### gulpModernizrWezom.pluginName

Property. Name of the plug-in in string

#### gulpModernizrWezom.pluginVersion

Property. The version of the plug-in in string

#### gulpModernizrWezom.getMetadata() → `{Array.<Object>}`

The method returns metadata of _"native"_ tests of `Modernizr` as an array

#### gulpModernizrWezom.getCustomMetadata (customTests) → `{Array.<Object>}`

The method returns the metadata of the _"custom"_ tests of the `Modernizr` as an array.

Parameters 

Name | Type | Description
--- | --- | ---
`customTests` | `string` | The relative path from the current working directory (`process.cwd ()`) to the directory with your user tests. For more details see [`customTests`](#customtests)

### gulpModernizrWezom( _[config]_ )

Building `modernizr.js`.  
The method accepts a configuration, based on which, it searches for the tests in the incoming files 
 
After - build the file `modernizr.js`. 
Even if no tests are specified or detected - the file `modernizr.js` will still be created, with the core of the library.

#### Configuration

##### `tests`

data type `Array.<string>`  
by default `[]`

Список тестов которые можно указать как обязательные. Если такие тесты отсутствуют во входящих файлах, они всеравно будут добавлены в сборку.

Вам следует указывать имена тестов, так как они указанны в метаданных каждого теста (ключ `property`).    
К примеру тест [`canvas/blending.js`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/blending.js) имеет значение [`canvasblending`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/blending.js#L4).

Есть некоторые файлы тестов, которые имеют несколько тестов в одном файле.  
К примеру [`canvas/todataurl.js`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/todataurl.js) Включает в себя 3 теста [`["todataurljpeg", "todataurlpng", "todataurlwebp"]`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/todataurl.js#L4). При необходимости включить любой из трех - остальные также будут добавлены, так как это один файл.

Example

```js
const gulp = require('gulp');
const gulpModernizrWezom = require('gulp-modernizr-wezom');

gulp.task('modernizr', function() {
    let src = [
        './dist/**/*.css',
        './dist/**/*.js',
        '!./dist/**/modernizr.js'
    ];

    return gulp.src(src)
        .pipe(gulpModernizrWezom({
            tests: [
                'touchevents',
                'ambientlight',
                'adownload',
                'canvasblending'
            ],
        }))
        .pipe(gulp.dest('./dist/'));
});
```

##### `customTests`

data type `string`  
by default `undefined`

Относительный путь от _текущей рабочей директории_ (`process.cwd()`) к директории с Вашим пользовательскими тестами

Есть несколько пунктов, которые Вы должны соблюдать и знать для корректного включения Ваших тестов в обший билд:

1. Внутри директории должны находится только `js` файлы.
1. Вы должны указать путь к родительской директории всех тестов, внутри Вы можете разбивать свои тесты на под директории, они будут включенны также.
1. Путь к Вашей к диретории НЕ должен содержать директорию с именем `feature-detects`, как пример можете использовать имя `my-feature-detects`
1. Вы можете указать только один путь к нужной Вам директории
1. Каждый файл теста должен иметь правильную структуру файла, для корректного построения метаданных `Modernizr`. Заготовка файла - [`my-feature-detects/sample.js`](./my-feature-detects/sample.js), пример пользовательского теста - [`my-feature-detects/custom-tests/android.js`](./my-feature-detects/custom-tests/android.js)
1. Если Вы указываете имя теста, который уже есть в списке _"родных"_ тестов `Modernizr` - то Вы перепишите его выполнение своим.


##### `excludeTests`

data type `Array.<string>`  
by default `[]`

A list of tests that should be excluded from the assembly, under any circumstances.  
The name rules are the same as for the [`tests`](#tests) property

Example

```js
const gulp = require('gulp');
const gulpModernizrWezom = require('gulp-modernizr-wezom');

gulp.task('modernizr', function() {
    let src = [
        './dist/**/*.css',
        './dist/**/*.js',
        '!./dist/**/modernizr.js'
    ];

    return gulp.src(src)
        .pipe(gulpModernizrWezom({
            tests: [
                'touchevents',
                'ambientlight',
                'adownload',
                'canvasblending'
            ],
            customTests: './my-feature-detects/custom-tests/',
            excludeTests: [
                'opacity',
                'checked'
            ]
        }))
        .pipe(gulp.dest('./dist/'));
});
```

##### `classPrefix`

data type `string`  
by default `undefined`

Строка, которая добавляется перед каждым классом CSS.

К примеру если указать `classPrefix: 'supports-'`, то `Modernizr` будет добавлять к `html` элементу CSS классы с этой приставкой, к примеру - `supports-no-ambientlight supports-canvas`.

Также ознакомтесь с разделом [Search for tests in `.js` and` .css` files](#Поиск-тестов-в-js-и-css-файлах) 



##### `options`

data type `Array.<string>`  
by default `[]`

Список опций, которые можно добавить для построения `Modernizr`.
   
- Полный список опций - https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json#L3
- Описание большинства опций - https://modernizr.com/docs/#modernizr-api

Если для определеных тестов нужны дополнительные опции, они будут добавлены автоматически (на основе метаданных каждого теста, к примеру [`hasEvent`](https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json#L7) будет автоматически добавлен при тесте [`ambientlight`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/ambientlight.js))

Если Вы хотите чтобы полученая версия сборки `modernizr.js`, при подключении в браузере, добавляла CSS классы к `html` элементу, следует явно указать опцию `setClasses`

Example

```js
const gulp = require('gulp');
const gulpModernizrWezom = require('gulp-modernizr-wezom');

gulp.task('modernizr', function() {
    let src = [
        './dist/**/*.css',
        './dist/**/*.js',
        '!./dist/**/modernizr.js'
    ];

    return gulp.src(src)
        .pipe(gulpModernizrWezom({
            tests: [
                'touchevents',
                'ambientlight',
                'adownload',
                'canvasblending'
            ],
            customTests: './my-feature-detects/custom-tests/',
            excludeTests: [
                'opacity',
                'checked'
            ],
            options: [
                'setClasses',
                'mq'
            ]
        }))
        .pipe(gulp.dest('./dist/'));
});
```



##### `minify`

data type `boolean`  
by default `false`

Minify the resulting file `modernizr.js`.

You can also use alternative methods for minimization, for example using [`gulp-uglify`](https://github.com/terinjokes/gulp-uglify) and, if need, [`gulp-sourcemaps`](https://github.com/gulp-sourcemaps/gulp-sourcemaps)

Example

```js
const gulp = require('gulp');
const gulpModernizrWezom = require('gulp-modernizr-wezom');
const gulpUglify = require('gulp-uglify');
const gulpSourcemaps = require('gulp-sourcemaps');

gulp.task('modernizr', function() {
    let src = [
        './dist/**/*.css',
        './dist/**/*.js',
        '!./dist/**/modernizr.js'
    ];

    return gulp.src(src)
        .pipe(gulpModernizrWezom({
            tests: [
                'touchevents',
                'ambientlight',
                'adownload',
                'canvasblending'
            ],
            customTests: './my-feature-detects/custom-tests/',
            excludeTests: [
                'opacity',
                'checked'
            ],
            options: [
                'setClasses',
                'mq'
            ]
        }))
        
        .pipe(gulpSourcemaps.init())
        .pipe(gulpUglify({
            mangle: {
            	except: ['Modernizr']
            }
        }))
        .pipe(gulpSourcemaps.write('/'))
        
        .pipe(gulp.dest('./dist/'));
});
```

---

### Search for tests in `.js` and` .css` files

To search for the necessary tests, the content of each incoming file is used. Text content is tested by regular expressions, which are compiled for each of the tests.

If a match is found, the test is added to the general build.

___CSS files___

To find the tests, plugin use the following regular expression:

```js
/\.(no-)?TEST\b[^-]/g
```

`TEST` - this is the name of each test in the loop.

If you use the property `classPrefix`, then the search for the tests in CSS files will also be performed taking into account the value of this property.

An example of a regular expression for searching, if `classPrefix: 'supports-'`

```js
/\.supports-(no-)?canvas\b[^-]/g
```

___JS files___

Property `classPrefix` - does not affect the search in `js` files.  
To find the tests, plugin use the following regular expression:

```js
/Modernizr\.filesystem\b[^-]/g
```

---

## Project Info

* [Change log](https://github.com/dutchenkoOleg/gulp-modernizr-wezom/blob/master/CHANGELOG.md)
* [Contributing Guidelines](https://github.com/dutchenkoOleg/gulp-modernizr-wezom/blob/master/CONTRIBUTING.md)
* [Contributor Covenant Code of Conduct](https://github.com/dutchenkoOleg/gulp-modernizr-wezom/blob/master/CODE_OF_CONDUCT.md)
* [License MIT](https://github.com/dutchenkoOleg/gulp-modernizr-wezom/blob/master/LICENSE)
