'use strict';

var async = require('async');
var fs = require('fs');
var should = require('should');
var gneuter = require('../index');
var path = require('path');
var gutil = require('gulp-util');
var File = gutil.File;

function readFileAsync(filepath) {
	var filepath = path.resolve(process.cwd(), filepath);

	return function(callback) {
		fs.readFile(filepath, function(err, data) {
			if (err) {
				return callback(err);
			}

			var file = new File({
				base: process.cwd(),
				path: path.relative(process.cwd(), filepath),
				contents: data,
			});

			return callback(null, file);
		});
	}
}

function loadFiles(original, result, callback) {
	async.parallel([
		readFileAsync(original),
		readFileAsync(result),
	], function(err, results) {
		if (err) {
			return callback(err);
		}

		callback(null, results[0], results[1]);
	});
}

describe('Require statements', function() {
	it('should combine in the order of the require statements', function(done) {
		var originalFile = 'test/fixtures/simple_require_statements.js';
		var expectedFile = 'test/expected/simple_require_statements.js';

		loadFiles(originalFile, expectedFile, function(err, original, expected) {
			if (err) {
				throw err;
			}

			var stream = gneuter();
			var i = 0;

			stream.on('data', function(result) {
				i.should.equal(0); // should only result in a single file
				i++;

				result.should.have.property('path');
		        result.should.have.property('relative');
		        result.should.have.property('contents');

				result.contents.toString().should.equal(expected.contents.toString());
			});

			stream.on('end', function() {
				i.should.equal(1); // should only output a single file
				done();
			});

			stream.write(original);
			stream.end();
		});
	});

	it('should be ignored if told so', function(done) {
		var originalFile = 'test/fixtures/ignores_files_when_told.js';
		var expectedFile = 'test/expected/ignores_files_when_told.js';

		loadFiles(originalFile, expectedFile, function(err, original, expected) {
			if (err) {
				throw err;
			}

			var stream = gneuter(null, null, {
				skipFiles: [
					'test/fixtures/contains_commonjs_require.js'
				],
			});
			var i = 0;

			stream.on('data', function(result) {
				i.should.equal(0); // should only result in a single file
				i++;

				result.should.have.property('path');
		        result.should.have.property('relative');
		        result.should.have.property('contents');

				result.contents.toString().should.equal(expected.contents.toString());
			});

			stream.on('end', function() {
				i.should.equal(1); // should only output a single file
				done();
			});

			stream.write(original);
			stream.end();
		});
	});

	it('in comments should be ignored', function(done) {
		var originalFile = 'test/fixtures/comment_out_require.js';
		var expectedFile = 'test/expected/comment_out_require.js';

		loadFiles(originalFile, expectedFile, function(err, original, expected) {
			if (err) {
				throw err;
			}

			var stream = gneuter();
			var i = 0;

			stream.on('data', function(result) {
				i.should.equal(0); // should only result in a single file
				i++;

				result.should.have.property('path');
		        result.should.have.property('relative');
		        result.should.have.property('contents');

				result.contents.toString().should.equal(expected.contents.toString());
			});

			stream.on('end', function() {
				i.should.equal(1); // should only output a single file
				done();
			});

			stream.write(original);
			stream.end();
		});
	});

	describe('which reference a local function', function() {
			it('should be ignored', function(done) {
			var originalFile = 'test/fixtures/local_require_definitions.js';
			var expectedFile = 'test/expected/local_require_definitions.js';

			loadFiles(originalFile, expectedFile, function(err, original, expected) {
				if (err) {
					throw err;
				}

				var stream = gneuter();
				var i = 0;

				stream.on('data', function(result) {
					i.should.equal(0); // should only result in a single file
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				});

				stream.on('end', function() {
					i.should.equal(1); // should only output a single file
					done();
				});

				stream.write(original);
				stream.end();
			});
		});
	});

	describe('not ending with a semicolon', function() {
		it('should be read correctly', function(done) {
			var originalFile = 'test/fixtures/optional_semicolons.js';
			var expectedFile = 'test/expected/optional_semicolons.js';

			loadFiles(originalFile, expectedFile, function(err, original, expected) {
				if (err) {
					throw err;
				}

				var stream = gneuter();
				var i = 0;

				stream.on('data', function(result) {
					i.should.equal(0); // should only result in a single file
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				});

				stream.on('end', function() {
					i.should.equal(1); // should only output a single file
					done();
				});

				stream.write(original);
				stream.end();
			});
		});
	});

	describe('with filepath transforms', function() {
		it('should combine in the order of the require statements', function(done) {
			var originalFile = 'test/fixtures/simple_require_filepath_transforms.js';
			var expectedFile = 'test/expected/simple_require_filepath_transforms.js';

			loadFiles(originalFile, expectedFile, function(err, original, expected) {
				if (err) {
					throw err;
				}

				var stream = gneuter(null, null, {
					filepathTransform: function(filepath) {
						return 'test/fixtures/' + filepath;
					},
				});
				var i = 0;

				stream.on('data', function(result) {
					i.should.equal(0); // should only result in a single file
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				});

				stream.on('end', function() {
					i.should.equal(1); // should only output a single file
					done();
				});

				stream.write(original);
				stream.end();
			});
		});
	});

	describe('with basepath options', function() {
		it('should combine in the order of the require statements', function(done) {
			var originalFile = 'test/fixtures/simple_require_filepath_transforms.js';
			var expectedFile = 'test/expected/simple_require_filepath_transforms.js';

			loadFiles(originalFile, expectedFile, function(err, original, expected) {
				if (err) {
					throw err;
				}

				var stream = gneuter(null, null, {
					basePath: 'test/fixtures/',
				});
				var i = 0;

				stream.on('data', function(result) {
					i.should.equal(0); // should only result in a single file
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				});

				stream.on('end', function() {
					i.should.equal(1); // should only output a single file
					done();
				});

				stream.write(original);
				stream.end();
			});
		});
	});

	describe('that are repeated', function() {
		it('should be ignored', function(done) {
			var originalFile = 'test/fixtures/duplicate_require_statements.js';
			var expectedFile = 'test/expected/duplicate_require_statements.js';

			loadFiles(originalFile, expectedFile, function(err, original, expected) {
				if (err) {
					throw err;
				}

				var stream = gneuter();
				var i = 0;

				stream.on('data', function(result) {
					i.should.equal(0); // should only result in a single file
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				});

				stream.on('end', function() {
					i.should.equal(1); // should only output a single file
					done();
				});

				stream.write(original);
				stream.end();
			});
		});
	});

	describe('with circular references', function() {
		it('should be correctly handled', function(done) {
			var originalFile = 'test/fixtures/circular_require_statements.js';
			var expectedFile = 'test/expected/circular_require_statements.js';

			loadFiles(originalFile, expectedFile, function(err, original, expected) {
				if (err) {
					throw err;
				}

				var stream = gneuter();
				var i = 0;

				stream.on('data', function(result) {
					i.should.equal(0); // should only result in a single file
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				});

				stream.on('end', function() {
					i.should.equal(1); // should only output a single file
					done();
				});

				stream.write(original);
				stream.end();
			});
		});
	});
});

describe('Relative require statements', function() {
	it('should combine in the order of the require statements', function(done) {
		var originalFile = 'test/fixtures/relative_require_statements.js';
		var expectedFile = 'test/expected/relative_require_statements.js';

		loadFiles(originalFile, expectedFile, function(err, original, expected) {
			if (err) {
				throw err;
			}

			var stream = gneuter();
			var i = 0;

			stream.on('data', function(result) {
				i.should.equal(0); // should only result in a single file
				i++;

				result.should.have.property('path');
		        result.should.have.property('relative');
		        result.should.have.property('contents');

				result.contents.toString().should.equal(expected.contents.toString());
			});

			stream.on('end', function() {
				i.should.equal(1); // should only output a single file
				done();
			});

			stream.write(original);
			stream.end();
		});
	});

	describe('with basepath options', function() {
		it('should combine in the order of the require statements', function(done) {
			var originalFile = 'test/fixtures/relative_requires_with_basepath.js';
			var expectedFile = 'test/expected/relative_requires_with_basepath.js';

			loadFiles(originalFile, expectedFile, function(err, original, expected) {
				if (err) {
					throw err;
				}

				var stream = gneuter(null, null, {
					basePath: 'test/fixtures/'
				});
				var i = 0;

				stream.on('data', function(result) {
					i.should.equal(0); // should only result in a single file
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				});

				stream.on('end', function() {
					i.should.equal(1); // should only output a single file
					done();
				});

				stream.write(original);
				stream.end();
			});
		});
	});
});

describe('Seperator options', function() {
	it('should be customizable', function(done) {
		var originalFile = 'test/fixtures/simple_require_statements.js';
		var expectedFile = 'test/expected/custom_separator_options.js';

		loadFiles(originalFile, expectedFile, function(err, original, expected) {
			if (err) {
				throw err;
			}

			var stream = gneuter(null, null, {
				separator: '!!!!',
			});
			var i = 0;

			stream.on('data', function(result) {
				i.should.equal(0); // should only result in a single file
				i++;

				result.should.have.property('path');
		        result.should.have.property('relative');
		        result.should.have.property('contents');

				result.contents.toString().should.equal(expected.contents.toString());
			});

			stream.on('end', function() {
				i.should.equal(1); // should only output a single file
				done();
			});

			stream.write(original);
			stream.end();
		});
	});
});

describe('Code order between require statements', function() {
	it('should be left intact', function(done) {
		var originalFile = 'test/fixtures/respects_code_order_between_requires.js';
		var expectedFile = 'test/expected/respects_code_order_between_requires.js';

		loadFiles(originalFile, expectedFile, function(err, original, expected) {
			if (err) {
				throw err;
			}

			var stream = gneuter();
			var i = 0;

			stream.on('data', function(result) {
				i.should.equal(0); // should only result in a single file
				i++;

				result.should.have.property('path');
		        result.should.have.property('relative');
		        result.should.have.property('contents');

				result.contents.toString().should.equal(expected.contents.toString());
			});

			stream.on('end', function() {
				i.should.equal(1); // should only output a single file
				done();
			});

			stream.write(original);
			stream.end();
		});
	});
});

describe('Patterns', function() {
	describe('with require("glob/*")', function() {
		it('should require all files in that directory', function(done) {
			var originalFile = 'test/fixtures/glob_require.js';
			var expectedFile = 'test/expected/glob_require.js';

			loadFiles(originalFile, expectedFile, function(err, original, expected) {
				if (err) {
					throw err;
				}

				var stream = gneuter();
				var i = 0;

				stream.on('data', function(result) {
					i.should.equal(0); // should only result in a single file
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				});

				stream.on('end', function() {
					i.should.equal(1); // should only output a single file
					done();
				});

				stream.write(original);
				stream.end();
			});
		});
	});

	describe('with spaces', function() {
		it('should include correctly', function(done) {
			var originalFile = 'test/fixtures/spaces_allowed_within_require_statement.js';
			var expectedFile = 'test/expected/spaces_allowed_within_require_statement.js';

			loadFiles(originalFile, expectedFile, function(err, original, expected) {
				if (err) {
					throw err;
				}

				var stream = gneuter();
				var i = 0;

				stream.on('data', function(result) {
					i.should.equal(0); // should only result in a single file
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				});

				stream.on('end', function() {
					i.should.equal(1); // should only output a single file
					done();
				});

				stream.write(original);
				stream.end();
			});
		});
	});

	describe('without .js extension', function() {
		it('should include correctly', function(done) {
			var originalFile = 'test/fixtures/optional_dotjs.js';
			var expectedFile = 'test/expected/optional_dotjs.js';

			loadFiles(originalFile, expectedFile, function(err, original, expected) {
				if (err) {
					throw err;
				}

				var stream = gneuter();
				var i = 0;

				stream.on('data', function(result) {
					i.should.equal(0); // should only result in a single file
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				});

				stream.on('end', function() {
					i.should.equal(1); // should only output a single file
					done();
				});

				stream.write(original);
				stream.end();
			});
		});
	});
});

describe('Source maps', function() {
	it('should be generated', function(done) {
		var originalFile = 'test/fixtures/glob_require.js';
		var expectedFile = 'test/expected/source_maps.map';

		loadFiles(originalFile, expectedFile, function(err, original, expected) {
			if (err) {
				throw err;
			}

			var outputFileName = 'source_maps.js'
			var mapFileName = 'source_maps.map';

			var stream = gneuter(outputFileName, mapFileName);
			var i = 0;

			stream.on('data', function(result) {
				if (path.basename(result.path) === mapFileName) {
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');

					result.contents.toString().should.equal(expected.contents.toString());
				} else if (path.basename(result.path) === outputFileName) {
					i++;

					result.should.have.property('path');
			        result.should.have.property('relative');
			        result.should.have.property('contents');
				} else {
					throw new Error('Unexpected file in stream: ' + result.path);
				}
			});

			stream.on('end', function() {
				i.should.equal(2); // should result in a source and a map file
				done();
			});

			stream.write(original);
			stream.end();
		});
	});
});

describe('Files', function() {
	it('should be processed as a template', function(done) {
		var originalFile = 'test/fixtures/process_as_template.js';
		var expectedFile = 'test/expected/process_as_template.js';

		loadFiles(originalFile, expectedFile, function(err, original, expected) {
			if (err) {
				throw err;
			}

			var stream = gneuter(null, null, {
				process: {
					foo: 5,
					bar: 'baz'
				}
			});
			var i = 0;

			stream.on('data', function(result) {
				i.should.equal(0); // should only result in a single file
				i++;

				result.should.have.property('path');
		        result.should.have.property('relative');
		        result.should.have.property('contents');

				result.contents.toString().should.equal(expected.contents.toString());
			});

			stream.on('end', function() {
				i.should.equal(1); // should only output a single file
				done();
			});

			stream.write(original);
			stream.end();
		});
	});

	it('should be processed with a function', function(done) {
		var originalFile = 'test/fixtures/simple_require.js';
		var expectedFile = 'test/expected/process_with_function.js';

		loadFiles(originalFile, expectedFile, function(err, original, expected) {
			if (err) {
				throw err;
			}

			var stream = gneuter(null, null, {
				process: function(file) {
					file.contents = Buffer.concat([
						new Buffer('// Source for: ' + file.path + '\n'),
						file.contents,
					]);
					return file;
				}
			});
			var i = 0;

			stream.on('data', function(result) {
				i++;

				result.should.have.property('path');
		        result.should.have.property('relative');
		        result.should.have.property('contents');

				result.contents.toString().should.equal(expected.contents.toString());
			});

			stream.on('end', function() {
				i.should.equal(1); // should only output a single file
				done();
			});

			stream.write(original);
			stream.end();
		});
	});
});
