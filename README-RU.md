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

- [Modernizr v3](https://github.com/Modernizr/Modernizr)
- [Полное управление составлением итогового файла](#gulpmodernizrwezom-options-)
- Возможность добавлять собственные тесты в общий билд
- Возможность переписывать родные тесты `Moderznizr` собственными
- Автоматическое добавление тестов из входящих файлов `gulp` задачи
- Автоматическое добавление опций `Moderznizr`, если они нужны для тестов сборки
- Корректный поиск тестов в `.js` и `.css` файлах

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
        .pipe(gulpModernizrWezom())
        .pipe(gulp.dest('./dist/'));
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

###### `tests`

тип данных `Array.<string>`
|
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
            tests: ['touchevents', 'ambientlight', 'adownload', 'canvasblending']
        }))
        .pipe(gulp.dest('./dist/'));
});
```

###### `customTests`




---

## Информация о проекте

* [История изменений](./CHANGELOG-RU.md)
* [Руководство по содействию проекту](./CONTRIBUTING-RU.md)
* [Кодекс поведения](./CODE_OF_CONDUCT-RU.md)
* [Лицензия MIT](./LICENSE)
