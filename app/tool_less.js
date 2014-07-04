var less = require('less');
var _= require('underscore');

var lessOptions = {
	parse: ['paths', 'optimization', 'filename', 'strictImports', 'syncImport', 'dumpLineNumbers', 'relativeUrls', 'rootpath'],
	render: ['compress', 'cleancss', 'ieCompat', 'strictMath', 'strictUnits']
};

function compileLess(srcCode, options, callback) {
	var parser = new less.Parser(_.pick(options, lessOptions.parse));
	var err;

	parser.parse(srcCode, function(parse_err, tree) {
		if (parse_err) {
			err = new Error();
			err.code = 20;
			err.message = lessError(parse_err);
			callback(err, srcCode);
			return;
		}

		try {
			var minifyOptions = _.pick(options, lessOptions.render);
			var css = tree.toCSS(minifyOptions);
			callback(null, css);
		} catch (e) {
			err = new Error();
			err.code = 20;
			err.message = lessError(e);
			callback(err, srcCode);
		}
	});
}

function formatLessError(e) {
	var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
	return e.filename + ': ' + pos + ' ' + e.message;
}

function lessError(e) {
	return less.formatError ? less.formatError(e) : formatLessError(e);
}

module.exports = compileLess;
