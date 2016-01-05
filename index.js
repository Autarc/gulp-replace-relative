'use strict'

var PluginError = require('gulp-util').PluginError
var through = require('through2')
var Promise = require('es6-promise').Promise

var PLUGIN_NAME = 'gulp-replace-relative'

module.exports = function replaceAsync (pattern, replacer) {
  var hasFunction = replacer instanceof Function
  if (pattern instanceof RegExp === false) {
    // escape special regex chars from string (source: http://stackoverflow.com/a/9310752)
    pattern = pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  }
  return through.obj(function (file, encoding, callback) {

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'))
      return callback()
    }

    if (file.isBuffer()) {
      var contents = file.contents.toString(encoding)
      var matches = contents.match(pattern)
      if (matches) {
        if (typeof replacer !== 'string' && !hasFunction) {
          this.emit('error', new PluginError(PLUGIN_NAME, 'Invalid replacer definition!'))
        }

        // ~ function
        if (hasFunction) {
          var replacements = matches.map(function (match) {
            return new Promise(function (resolve) {
              var replacement = replacer(file, match, resolve)
              if (typeof replacement !== 'undefined') {
                return resolve(replacement)
              }
            })
          })
          return Promise.all(replacements)
          .then(function (results) {
            matches.forEach(function (match, index) {
              var result = results[index]
              if (result) {
                contents = contents.replace(match, result)
              }
            })
            file.contents = new Buffer(contents)
            return callback(null, file)
          })
          .catch(callback)
        }

        // ~ string
        matches.forEach(function (match) {
          contents = contents.replace(match, replacer)
        })
        file.contents = new Buffer(contents)
      }
    }

    return callback(null, file)
  })
}
