# gulp-neuter [![Build Status](https://travis-ci.org/squarewolf/gulp-neuter.png?branch=master)](https://travis-ci.org/squarewolf/node-neuter) [![Dependencies](https://david-dm.org/squarewolf/gulp-neuter.png)](https://david-dm.org/) [![Code Climate](https://codeclimate.com/github/squarewolf/gulp-neuter.png)](https://codeclimate.com/github/squarewolf/gulp-neuter)

> Unifies javascript source files in the order you require

## Usage

First, install `gulp-neuter` as a development dependency:

```shell
npm install --save-dev gulp-neuter
```

Then, add it to your `gulpfile.js`:

```javascript
var neuter = require('gulp-neuter');

gulp.task('templates', function(){
  gulp.src(['js/main.js'])
    .pipe(handlebars())
    .pipe(gulp.dest('build/templates/'));
});
```

## API

### neuter(options)

For the full list of options, have a look at the
[node-neuter](https://github.com/squarewolf/node-neuter) documentation.
Gulp-neuter is a minimalistic wrapper on top of
[node-neuter](https://github.com/squarewolf/node-neuter) and supports all
options as listed.
