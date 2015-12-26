var gulp = require('gulp');
var neuter = require('../../');
var clean = require('gulp-clean');

var inputDir = 'src';
var buildDir = 'build';

var config = {
	js: {
		input: inputDir + '/**.js',
		output: buildDir,
	},
	html: {
		input: [
			inputDir + '/**/*.html',
			inputDir + '/**/*.htm',
		],
		output: buildDir,
	}
};

gulp.task('clean', function() {
	var paths = [
		buildDir + '/**/*',
	];

	return gulp.src(paths, {
			read: false
		})
		.pipe(clean());
});

gulp.task('build-html', function() {
	return gulp.src(config.html.input)
		.pipe(gulp.dest(config.html.output));
});

gulp.task('build-js', function() {
	return gulp.src(config.js.input)
		.pipe(neuter('main.js', 'main.map', {
			basePath: inputDir,
		}))
		.pipe(gulp.dest(config.js.output));
});

gulp.task('default', [
	'build-html',
	'build-js',
], function() {
});
