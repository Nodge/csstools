var less = require('less');
var _= require('underscore');

var lessOptions = {
	parse: ['paths', 'optimization', 'filename', 'strictImports', 'syncImport', 'dumpLineNumbers', 'relativeUrls', 'rootpath'],
	render: ['compress', 'cleancss', 'ieCompat', 'strictMath', 'strictUnits']
};

module.exports = function(app) {
	function compileLess(srcCode, options, callback) {
		var parser = new less.Parser(_.pick(options, lessOptions.parse));
		var err;

		parser.parse(srcCode, function(parse_err, tree) {
			if (parse_err) {
				err = app.createError(app.ERROR_LESS_PARSE, parse_err);
				callback(err, srcCode);
				return;
			}

			try {
				var css = tree.toCSS(_.pick(options, lessOptions.render));
				callback(null, css);
			}
			catch (e) {
				err = app.createError(app.ERROR_LESS_RENDER, lessError(e));
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

	compileLess.VERSION = require('../../node_modules/less/package.json').version;
	return compileLess;
};
