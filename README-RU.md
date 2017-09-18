# gulp-modernizr-wezom

![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-orange.svg)
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-modernizr-wezom.svg?branch=dev)](https://travis-ci.org/dutchenkoOleg/gulp-modernizr-wezom)


:us: [English](./README.md)
|
:ru: Русский язык

> _Gulp плагин для [moderznir](https://github.com/Modernizr/Modernizr), [Wezom](http://wezom.com.ua/) версия_

[![js happiness style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)


## Основные возможности и преимущества

- [Modernizr v3 ⇒](https://github.com/Modernizr/Modernizr)
- [Полное управление составлением итогового файла](#Опции)
	- [Явное указание нужных тестов, которые нужны при любых условиях](#tests)
	- [Автоматическое добавление тестов из входящих файлов `gulp` задачи](#gulpmodernizrwezom-options-)
	- [Явное указание нужных опций, которые нужны при любых условиях](#options)
	- [Автоматическое добавление опций `Moderznizr`, если они нужны для тестов сборки](#gulpmodernizrwezom-options-)
	- [Возможность добавлять собственные тесты и переписывать _"родные"_ тесты `Modernizr`](#customtests)
	- [Возможность исключать нежелательные тесты](#excludetests)
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
        './dist/**/*.css', // входящие файлы в которых будет выролнен поиск тестов
        './dist/**/*.js', // входящие файлы в которых будет выролнен поиск тестов
        '!./dist/**/modernizr.js' // исключение файла самой библиотеки Modernizr
    ];

    return gulp.src(src)
        .pipe(gulpModernizrWezom({
            tests: [ // добавить тесты, внезависимости от поиска в файлах
                'touchevents',
                'ambientlight',
                'adownload',
                'canvasblending'
            ],
            customTests: './my-feature-detects/custom-tests/', // пользовательские тесты
            excludeTests: [ // исключить нежелательные тесты
                'opacity',
                'checked'
            ]
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

Параметры 

Name | Type | Description
--- | --- | ---
`customTests` | `string` | Относительный путь от _текущей рабочей директории_ (`process.cwd()`) к директории с Вашим пользовательскими тестами. Более детально смотрите [`customTests`](#customtests)

Метод возвращает метаданные _"пользовательских"_ тестов `Modernizr` в виде массива.

### gulpModernizrWezom( _[options]_ )

Метод построения `modernizr.js`.  
Метод принимает опции и на их основе производит поиск тестов во входящих файлах. Если для определеных тестов нужны дополнительные опции, они будут добавленны автоматически (на основе метаданных каждого теста, к примеру [`hasEvent`](https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json#L7) будет автоматически добавлен при тесте [`ambientlight`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/ambientlight.js))  
 
После чего выполняется создание файла `modernizr.js`.  
Даже если никаких тестов не будет указано или обнаржено - файл `modernizr.js` все равно будет создан, с ядром библиотеки.

#### Опции

##### `tests`

тип данных `Array.<string>`  
по умолчанию `[]`

Список тестов которые можно указать как обязательные. Если такие тесты отсутствуют во входящих файлах, они всеравно будут добавлены в сборку.

Вам следует указывать имена тестов, как они указанны в метаданных каждого теста (ключ `property`).    
К примеру тест [`canvas/blending.js`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/blending.js) имеет значение [`canvasblending`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/blending.js#L4).

Есть некоторые файлы тестов, которые имеют несколько тестов в одном файле.  
К примеру [`canvas/todataurl.js`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/todataurl.js) Включает в себя 3 теста [`["todataurljpeg", "todataurlpng", "todataurlwebp"]`](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/todataurl.js#L4). При необходимости включить любой из трех - остальные также будут добавлены, так это один файл.

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
1. Каждый файл теста должен иметь правильную структуру файла, для корректного построения метаданных `Modernizr`. Заготовка файла [`my-feature-detects/sample.js`](./my-feature-detects/sample.js), пример пользовательского теста [`my-feature-detects/custom-tests/android.js`](./my-feature-detects/custom-tests/android.js)
1. Если Вы указаываете имя теста, который уже есть в списке _"родных"_ тестов `Modernizr` - то перепишите его выполнение своим.
1. Вы должны указать путь к родительской директории всех тестов, внутри Вы можете разбивать свои тесты на под директории, они будут включенны также.
1. Путь к Вашей к диретории НЕ должен содержать директорию с именем `feature-detects`, как пример можете использовать имя `my-feature-detects`


##### `excludeTests`

тип данных `Array.<string>`  
по умолчанию `[]`

Список тестов, которые следует исключить при люьых обстаятельствах.  
Привил имен такое же как при указании свойства [`tests`](#tests)

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
---

### Поиск тестов в `.js` и `.css` файлах




---

## Информация о проекте

* [История изменений](./CHANGELOG-RU.md)
* [Руководство по содействию проекту](./CONTRIBUTING-RU.md)
* [Кодекс поведения](./CODE_OF_CONDUCT-RU.md)
* [Лицензия MIT](./LICENSE)
