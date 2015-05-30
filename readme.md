## Description

This is a [`gulp`](http://gulpjs.com) plugin for
[`atril`](https://github.com/Mitranim/atril), an experimental UI framework in
the collective spirit of ReactJS, Polymer, Angular 2 and Aurelia.

Converts HTML templates into JavaScript modules that self-add to `atril`'s
template cache. This lets you avoid runtime XHR imports.

**Note**: the converted files are in the ES6 module format. You'll need to
transpile them into your chosen module format (SystemJS / CommonJS / AMD) with
`gulp-babel`.

## Installation and Usage

To install:

```shell
npm i --save-dev gulp-atril-html2js
```

### Without Concatenation

In your `gulpfile.js`:

```javascript
var $ = require('gulp-load-plugins')();

gulp.task('templates', function() {
  return gulp.src([
      'src/app/**/*.html',
      'src/app/**/*.svg'
    ])
    .pipe($.atrilHtml2js({stripPrefix: 'src'}))
    .pipe($.babel({modules: 'system'}))
    .pipe(gulp.dest('dist/app'));
});
```

In your scripts:

```typescript
// Each template has to be imported separately.
import 'app/my-component/my-component.html';
import {Component} from 'atril';

@Component({my-component})
class VM {static templateUrl = 'app/my-component/my-component.html'}
```

### With Concatenation

In your `gulpfile.js`:

```javascript
var $ = require('gulp-load-plugins')();

gulp.task('templates', function() {
  return gulp.src([
      'src/app/**/*.html',
      'src/app/**/*.svg'
    ])
    .pipe($.atrilHtml2js({
      stripPrefix: 'src',
      concat: 'templates.js'
    }))
    .pipe($.babel({modules: 'system'}))
    .pipe(gulp.dest('dist/app'));
});
```

In your scripts:

```typescript
// Imports and caches all templates at once.
import 'app/templates';
import {Component} from 'atril';

@Component({my-component})
class VM {static templateUrl = 'app/my-component/my-component.html'}
```

## Alternative

A great alternative for `SystemJS` / `jspm` users is the SystemJS [text
plugin](https://github.com/systemjs/plugin-text). Example usage:

```
import template from './template!text';
import {Component} from 'atril';

@Component({my-component})
class VM {static template = template}
```

This automatically works with `jspm`'s bundling. If you're not using TypeScript
(which is impossible to stop from complaining about relative text imports), this
is a better option than `gulp-atril-html2js`.

## License

MIT
