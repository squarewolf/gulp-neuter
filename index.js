var Neuter = require('neuter');
var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var async = require('async');
var sourceMap = require('source-map');
var SourceMapConsumer = sourceMap.SourceMapConsumer;
var SourceMapGenerator = sourceMap.SourceMapGenerator;

var PLUGIN_NAME = 'gulp-neuter';

var MAPPING_INCLUDE = new Buffer('//@ sourceMappingURL=');

module.exports = function(outputFileName, mapFileName, options) {
	if (mapFileName && !outputFileName) {
		throw new PluginError(PLUGIN_NAME, 'Missing outputFileName parameter');
	}

	if (outputFileName && !mapFileName) {
		throw new PluginError(PLUGIN_NAME, 'Missing mapFileName parameter');
	}

	if (options !== undefined && typeof options !== 'object') {
		throw new PluginError(PLUGIN_NAME, 'Missing options parameter should be an object');
	}

	options = options || {};

	return through.obj(function (file, enc, done) {
		if (file.isNull()) {
			// ignore null files
			return done();
		}

		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return done();
		}
		
		if (options.basePath) {
			// 
			// !! IMPORTANT !!
			// The basepath set in the passed file object must match the basepath
			// set in the neuter options. If not, requires relying on the basepath
			// might fail.
			// 
			file.base = options.basePath;
			file.path = path.relative(options.basePath, file.path);
		}

		var neuter = new Neuter(options);
		neuter.parse(file, (function(err, sourceNode) {
			if (err) {
				this.emit('error', new PluginError(PLUGIN_NAME, err));
				return done();
			}

			var options = {};
			if (outputFileName) {
				options.file = outputFileName;
			} else {
				options.file = path.basename(file.path);
				console.log(options.file);
			}

			var codeMap = sourceNode.toStringWithSourceMap(options);

			var sourceFile = new File({
				cwd: file.cwd,
				base: file.base,
				path: path.join(file.base, options.file),
				contents: new Buffer(codeMap.code),
			});

			if (mapFileName) {
				var consumer = new SourceMapConsumer(codeMap.map.toJSON());
				var generator = SourceMapGenerator.fromSourceMap(consumer);
				var newSourceMap = generator.toJSON();
				newSourceMap.file = path.basename(newSourceMap.file);

				var sourceMap = JSON.stringify(newSourceMap, null, '  ');
				var mapFile = new File({
					cwd: file.cwd,
					base: file.base,
					path: path.join(file.base, mapFileName),
					contents: new Buffer(sourceMap),
				})

				this.push(mapFile);

				sourceFile.contents = Buffer.concat([
					sourceFile.contents,
					MAPPING_INCLUDE,
					new Buffer(path.relative(sourceFile.path, mapFile.path)),
				]);
			}

			this.push(sourceFile);

			done();
		}).bind(this));
	});
};
