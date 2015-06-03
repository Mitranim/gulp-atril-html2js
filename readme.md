## Description

This is a [`gulp`](http://gulpjs.com) plugin for
[`atril`](http://mitranim.com/atril/), an experimental UI framework in
the collective spirit of ReactJS, Polymer, Angular 2 and Aurelia.

Converts HTML templates into JavaScript modules that self-add to `atril`'s
view cache. This lets you avoid runtime XHR imports.

The converted files use `require` style imports.

## Installation and Usage

To install:

```shell
npm i --save-dev gulp-atril-html2js
```

### Without Concatenation

In your `gulpfile.js`:

```javascript
var $ = require('gulp-load-plugins')();

gulp.task('views', function() {
  return gulp.src([
      'src/app/**/*.html',
      'src/app/**/*.svg'
    ])
    .pipe($.atrilHtml2js({stripPrefix: 'src'}))
    .pipe(gulp.dest('dist/app'));
});
```

In your scripts:

```typescript
// Each view has to be imported separately.
import 'app/my-component/my-component.html';
import {Component} from 'atril';

@Component({my-component})
class VM {static viewUrl = 'app/my-component/my-component.html'}
```

### With Concatenation

In your `gulpfile.js`:

```javascript
var $ = require('gulp-load-plugins')();

gulp.task('views', function() {
  return gulp.src([
      'src/app/**/*.html',
      'src/app/**/*.svg'
    ])
    .pipe($.atrilHtml2js({
      stripPrefix: 'src',
      concat: 'views.js'
    }))
    .pipe(gulp.dest('dist/app'));
});
```

In your scripts:

```typescript
// Imports and caches all views at once.
import 'app/views';
import {Component} from 'atril';

@Component({my-component})
class VM {static viewUrl = 'app/my-component/my-component.html'}
```

## Alternative

A great alternative for `SystemJS` / `jspm` users is the SystemJS [text
plugin](https://github.com/systemjs/plugin-text). Example usage:

```
import {Component} from 'atril';
// Import as a string.
import view from './my-component.html!text';

@Component({my-component})
class VM {static view = view}
```

This automatically works with `jspm`'s bundling. If you're not using TypeScript
(which is impossible to stop from complaining about relative text imports), this
is a better option than `gulp-atril-html2js`.

## License

MIT
