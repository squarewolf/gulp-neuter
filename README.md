# gulp-neuter [![Build Status](https://travis-ci.org/squarewolf/gulp-neuter.png?branch=master)](https://travis-ci.org/squarewolf/gulp-neuter) [![Dependencies](https://david-dm.org/squarewolf/gulp-neuter.png)](https://david-dm.org/squarewolf/gulp-neuter) [![Code Climate](https://codeclimate.com/github/squarewolf/gulp-neuter.png)](https://codeclimate.com/github/squarewolf/gulp-neuter)

> Unifies javascript source files in the order you require

## Usage

First, install `gulp-neuter` as a development dependency:

```shell
npm install --save-dev gulp-neuter
```

Then, add it to your `gulpfile.js`:

```javascript
var gulp = require('gulp');
var neuter = require('gulp-neuter');

var inputDir = 'src';
var outputDir = 'build';

gulp.task('build-js', function() {
	return gulp.src(inputDir + '/**.js')
		.pipe(neuter('main.js', 'main.map', {
			basePath: inputDir,
		}))
		.pipe(gulp.dest(outputDir));
});
```

## API

### neuter([outputFileName, mapFileName[, options]])

* `outputFileName` (*string*); the name of the output file to use in the source map.
* `mapFileName` (*string*); the name of the source map output file used to link the map file to the neutered js file.
* `options` (*object*); for the full list of options, have a look at the
[node-neuter](https://github.com/squarewolf/node-neuter) documentation.
Gulp-neuter is a minimalistic wrapper on top of
[node-neuter](https://github.com/squarewolf/node-neuter) and supports all
options as listed.
