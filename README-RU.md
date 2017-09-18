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
- Полное управление составлением итогового файла
- Возможность добавлять собственные тесты в общий билд
- Возможность переписывать родные тесты `Moderznizr` собственными
- Кооректный поиск тестов в `.js` и `.css` файлах

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
        './dist/**/*.css',
        './dist/**/*.js',
        '!./dist/**/modernizr.js'
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

### gulpModernizrWezom()

Метод построения `modernizr.js`.  
Метод принимает опции и на их основе произвадит поиск в полученных файлах.
 После чего выполняет создание файла `modernizr.js`

###### `customTests`




---

## Информация о проекте

* [История изменений](./CHANGELOG-RU.md)
* [Руководство по содействию проекту](./CONTRIBUTING-RU.md)
* [Кодекс поведения](./CODE_OF_CONDUCT-RU.md)
* [Лицензия MIT](./LICENSE)
