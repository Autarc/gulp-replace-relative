[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# gulp-replace-relative

> Replace matched content in files with support for relative paths

Similar to [gulp-replace](https://github.com/lazd/gulp-replace) this plugin allows to change the files content
and like [gulp-replace-async](https://github.com/naturalatlas/gulp-replace-async) it supports asynchronous
tasks to retrieve data. It can be used for relative includes and source transformation on demand.

## Install

```
$ npm install --save-dev gulp-replace-relative
```

## Usage

```js
var replaceRelative = require('gulp-replace-relative')

gulp.task('replace', function(){
	return gulp.src('index.js')
	            .pipe(replaceRelative(/pattern-(.*?)/g, function (file, match, callback) {
		            console.log(file, match)
		          })
})
```

### Process file transformation ("like webpack loaders on the server")

```js
gulp.task('replace', function(){
	return gulp.src('index.js')
				 .pipe(replaceRelative(/require\('\.\/(.*?\.styl')\/g, function (file, match, callback) {
					 var includePath = match.match(/\('(.*?\.styl)'\)/)[1]						 
					 fs.readFile(path.resolve(path.dirname(file.path), includePath), function (error, data) {
						 var css = stylus(data.toString()).render()
						 postcss([
						  autoprefixer({
							 browsers: ['last 2 versions']
							}),
							cssnano
						 ])
						 .process(css)
						 .then(function (result) {
						  return callback('"' + result.css + '"')
						 })
					 })
				 })
})

```

## API

### replaceRelative(pattern, replacer)

Returns a [transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform).

#### pattern

Type: `string`, `regex`

Defines the pattern to match.


##### replacer

Type: `string`, `function`

A defined function retrieves following parameters: replace(file, match, callback)


## TODO
- add tests
