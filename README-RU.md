# gulp-modernizr-wezom

![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-orange.svg)
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-modernizr-wezom.svg?branch=dev)](https://travis-ci.org/dutchenkoOleg/gulp-modernizr-wezom)


:us: [English](./README.md)
|
:ru: Русский

> _Gulp плагин для [moderznir](https://github.com/Modernizr/Modernizr), [Wezom](http://wezom.com.ua/) версия_

[![js happiness style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)


## Содержание

- [Основные возможности и преимущества](#Основные-возможности-и-преимущества)
- [Установка](#Установка)
- [Пример использования](#Пример-использования)
- [Методы и Параметры плагина](#Методы-и-Параметры-плагина)
- [Поиск тестов в `.js` и `.css` файлах](#Поиск-тестов-в-js-и-css-файлах)
- [Информация о проекте](#Информация-о-проекте)


## Основные возможности и преимущества

- [Modernizr v3 ⇒](https://github.com/Modernizr/Modernizr)
- [Полное управление составлением итогового файла](#Конфигурация)
	- [Явное указание тестов, которые нужны при любых условиях](#tests)
	- [Автоматическое добавление тестов из входящих файлов `gulp` задачи](#Поиск-тестов-в-js-и-css-файлах)
	- [Явное указание опций, которые нужны при любых условиях](#options)
	- [Автоматическое добавление опций `Moderznizr`, если они нужны для тестов сборки](#options)
	- [Возможность добавлять собственные тесты и переписывать _"родные"_ тесты `Modernizr`](#customtests)
	- [Возможность исключить нежелательные тесты](#excludetests)
- [Корректный поиск тестов в `.js` и `.css` файлах](#Поиск-тестов-в-js-и-css-файлах)

---

## Установка

```shell
npm i --save gulp-modernizr-wezom
# или при помощи yarn клиента
yarn add gulp-modernizr-wezom
```

## Пример использования

```js
const gulp = require('gulp');
const gulpModernizrWezom = require('gulp-modernizr-wezom');

gulp.task('modernizr', function() {
    let src = [
        './dist/**/*.css', // входящие файлы в которых будет выполнен поиск тестов
        './dist/**/*.js', // входящие файлы в которых будет выполнен поиск тестов
        '!./dist/**/modernizr.js' // исключение файла самой библиотеки Modernizr
    ];

    return gulp.src(src)
        .pipe(gulpModernizrWezom({
            tests: [ // добавить тесты принудительно
                'touchevents',
                'ambientlight',
                'adownload',
                'canvasblending'
            ],
            customTests: './my-feature-detects/custom-tests/', // пользовательские тесты
            excludeTests: [ // исключить нежелательные тесты
                'opacity',
                'checked'
            ],
             options: [ // добавить опции для ядра Modernizr
                 'setClasses',
                 'mq'
             ],
             minify: true // минифицировать итоговый файл modernizr.js
        }))
        .pipe(gulp.dest('./dist/')); // сохранить итоговый файл modernizr.js
});
```

## Методы и Параметры плагина

#### gulpModernizrWezom.pluginName

Свойство. Имя плагина строкой

#### gulpModernizrWezom.pluginVersion

Свойство. Версия плагина строкой

#### gulpModernizrWezom.getMetadata() → `{Array.<Object>}`

Метод возвращает метаданные _"родных"_ тестов `Modernizr` в виде массива

#### gulpModernizrWezom.getCustomMetadata (customTests) → `{Array.<Object>}`

Метод возвращает метаданные _"пользовательских"_ тестов `Modernizr` в виде массива.

Параметры 

Name | Type | Description
--- | --- | ---
`customTests` | `string` | Относительный путь от _текущей рабочей директории_ (`process.cwd()`) к директории с Вашим пользовательскими тестами. Более детально смотрите [`customTests`](#customtests)

### gulpModernizrWezom( _[config]_ )

Метод построения `modernizr.js`.  
Метод принимает конфигурацию, на основе которой, производит поиск тестов во входящих файлах. 
 
После - выполняется сборка файла `modernizr.js`.  
Даже если никаких тестов не будет указано или обнаружено - файл `modernizr.js` все равно будет создан, с ядром библиотеки.

#### Конфигурация

##### `tests`

тип данных `Array.<string>`  
по умолчанию `[]`

Список тестов которые можно указать как обязательные. Если такие тесты отсутствуют во входящих файлах, они всеравно будут добавлены в сборку.

Вам следует указывать имена тестов, так как они указаны в метаданных каждого теста (ключ `property`).    
К примеру тест [`canvas/blending.js`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/blending.js) имеет значение [`canvasblending`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/blending.js#L4).

Есть некоторые файлы тестов, которые имеют несколько тестов в одном файле.  
К примеру [`canvas/todataurl.js`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/todataurl.js) Включает в себя 3 теста [`["todataurljpeg", "todataurlpng", "todataurlwebp"]`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/todataurl.js#L4). При необходимости включить любой из трех - остальные также будут добавлены, так как это один файл.

Пример

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

тип данных `string`  
по умолчанию `undefined`

Относительный путь от _текущей рабочей директории_ (`process.cwd()`) к директории с Вашим пользовательскими тестами

Есть несколько пунктов, которые Вы должны соблюдать и знать для корректного включения Ваших тестов в обший билд:

1. Внутри директории должны находится только `js` файлы.
1. Вы должны указать путь к родительской директории всех тестов, внутри Вы можете разбивать свои тесты на под директории, они будут включенны также.
1. Путь к Вашей к диретории НЕ должен содержать директорию с именем `feature-detects`, как пример можете использовать имя `my-feature-detects`
1. Вы можете указать только один путь к нужной Вам директории
1. Каждый файл теста должен иметь правильную структуру файла, для корректного построения метаданных `Modernizr`. Заготовка файла - [`my-feature-detects/sample.js`](./my-feature-detects/sample.js), пример пользовательского теста - [`my-feature-detects/custom-tests/android.js`](./my-feature-detects/custom-tests/android.js)
1. Если Вы указываете имя теста, который уже есть в списке _"родных"_ тестов `Modernizr` - то Вы перепишите его выполнение своим.


##### `excludeTests`

тип данных `Array.<string>`  
по умолчанию `[]`

Список тестов, которые следует исключить из сборки, при любых обстаятельствах.  
Правила имен такие же как при указании свойства [`tests`](#tests)

Пример

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

тип данных `string`  
по умолчанию `undefined`

Строка, которая добавляется перед каждым классом CSS.

Например, если указать `classPrefix: 'supports-'`, то `Modernizr` будет добавлять к `html` элементу CSS классы с этой приставкой, к примеру - `supports-no-ambientlight supports-canvas`.
Также ознакомьтесь с разделом [Поиск тестов в `.js` и `.css` файлах](#Поиск-тестов-в-js-и-css-файлах), для большей информации.



##### `options`

тип данных `Array.<string>`  
по умолчанию `[]`

Список опций, которые можно добавить для построения `Modernizr`.
   
- Полный список опций - https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json#L3
- Описание большинства опций - https://modernizr.com/docs/#modernizr-api

Если для определенных тестов нужны дополнительные опции, они будут добавлены автоматически (на основе метаданных каждого теста, к примеру [`hasEvent`](https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json#L7) будет автоматически добавлен при тесте [`ambientlight`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/ambientlight.js))

Если Вы хотите чтобы полученая версия сборки `modernizr.js`, при подключении в браузере, добавляла CSS классы к `html` элементу, следует явно указать опцию `setClasses`

Пример

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

тип данных `boolean`  
по умолчанию `false`

Минифицировать итоговый файл `modernizr.js`.

Вы также можете использовать альтернативные методы для минификации, например используя [`gulp-uglify`](https://github.com/terinjokes/gulp-uglify) и, при необходимости, [`gulp-sourcemaps`](https://github.com/gulp-sourcemaps/gulp-sourcemaps)

Пример

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

### Поиск тестов в `.js` и `.css` файлах

Для поиска нужных тестов, используется контент каждого входящяго файла, Вашей `gulp` задачи. Текстовый контент тестируеться регулярными выражениями, которые составляються для каждого из тестов. 

Если совпадение найдено - тест добавляется в общий билд.

___CSS файлы___

Для поиска тестов используется следующее регулярное выражение:

```js
/\.(no-)?TEST\b[^-]/g
```

`TEST` - это имя каждого теста в цикле.

Если Вы используете свойство `classPrefix`, то поиск тестов в CSS файлах будет выполнен также с учетом значения этого свойтва.  

Пример регулярного выражения для поиска, если `classPrefix: 'supports-'`

```js
/\.supports-(no-)?canvas\b[^-]/g
```

___JS файлы___

Свойство `classPrefix` - никак не влияет на поиск в `js` файлах.  
Для поиска тестов используется следующее регулярное выражение:

```js
/Modernizr\.TEST\b[^-]/g
```

`TEST` - это имя каждого теста в цикле.





---

## Информация о проекте

* [История изменений](./CHANGELOG-RU.md)
* [Руководство по содействию проекту](./CONTRIBUTING-RU.md)
* [Кодекс поведения](./CODE_OF_CONDUCT-RU.md)
* [Лицензия MIT](./LICENSE)
