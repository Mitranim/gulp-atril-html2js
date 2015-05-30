'use strict';

/******************************* Dependencies ********************************/

var pt      = require('path');
var through = require('through2');
var File    = require('vinyl');

/********************************* Generator *********************************/

/**
 * interface Options {
 *
 *   // Strip this prefix from file paths in addition to process.cwd().
 *   stripPrefix: string;
 *
 *   // Concat all files under the given name/path. If not provided, files
 *   // are not buffered or concatenated.
 *   concat: string;
 *
 * }
 */
module.exports = function(options /* : Options */) {
  options = options || {};

  var baseDir = process.cwd();

  if (options.stripPrefix) {
    console.assert(typeof options.stripPrefix === 'string',
                   "'stripPrefix' must be a string, got:", options.stripPrefix);
    baseDir = pt.join(baseDir, options.stripPrefix);
  }

  if (options.concat) {
    console.assert(typeof options.concat === 'string',
                   "'concat' must be a string, got:", options.concat);
  }

  var concatenated = "import {templateCache} from 'atril';\n";

  function transform(file, e, done) {
    if (file.isNull() || file.isDirectory()) {
      return void done();
    }

    if (file.isStream()) {
      this.emit('error', new Error("I'm too lazy to process files in chunks"));
      return void done();
    }

    var url = pt.relative(baseDir, file.path);

    if (options.concat) {
      concatenated += cacheAssignment(file.contents.toString(), url);
    } else {
      this.push(new File({
        path: url + '.js',
        contents: new Buffer(oneToEs6(file.contents.toString(), url))
      }));
    }
    done();
  }

  function flush(done) {
    if (options.concat) {
      this.push(new File({
        path: options.concat,
        contents: new Buffer(concatenated)
      }));
    }
    done();
  }

  return through.obj(transform, flush)
}

function oneToEs6(template, url) {
  return "import {templateCache} from 'atril';\n" + cacheAssignment(template, url);
}

function cacheAssignment(template, url) {
  var wrapped = "'" + template.replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
  return 'templateCache[\'' + url.replace(/'/g, "\\'") + '\'] = ' + wrapped + ';\n';
}