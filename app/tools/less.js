var less = require('less');
var _ = require('underscore');
var path = require('path');

var lessOptions = {
	parse: ['paths', 'optimization', 'filename', 'strictImports', 'syncImport', 'dumpLineNumbers', 'relativeUrls', 'rootpath'],
	render: ['compress', 'cleancss', 'ieCompat', 'strictMath', 'strictUnits']
};

function fileLoader(options) {
	return function(originalHref, currentFileInfo, callback, env) {
		if (currentFileInfo && currentFileInfo.currentDirectory && !/^([a-z-]+:)?\//.test(originalHref)) {
			originalHref = currentFileInfo.currentDirectory + '/' + originalHref;
		}

		var href = originalHref; // relative to root file

		href = path.normalize(href);
		href = href.split(path.sep).join('/');

		var newEntryPath = path.dirname(href);
		if (newEntryPath === '.') {
			newEntryPath = '';
		}

		var newFileInfo = {
			currentDirectory: newEntryPath,
			filename: href
		};

		if (currentFileInfo) {
			newFileInfo.entryPath = currentFileInfo.entryPath;
			newFileInfo.rootpath = currentFileInfo.rootpath;
			newFileInfo.rootFilename = currentFileInfo.rootFilename;
			newFileInfo.relativeUrls = currentFileInfo.relativeUrls;
		}
		else {
			newFileInfo.entryPath = newEntryPath;
			newFileInfo.rootpath = less.rootpath || newEntryPath;
			newFileInfo.rootFilename = href;
			newFileInfo.relativeUrls = env.relativeUrls;
		}

		/*if (newFileInfo.relativeUrls) {
			if (env.rootpath) {
				newFileInfo.rootpath = extractUrlParts(env.rootpath + pathDiff(hrefParts.path, newFileInfo.entryPath)).path;
			} else {
				newFileInfo.rootpath = hrefParts.path;
			}
		}*/

		try {
			// todo: error
			var lessText = '';

			if (options.importFiles && options.importFiles[href]) {
//				console.log('include', href);
				lessText = options.importFiles[href];
			}
			else {
				console.log('not found', href, currentFileInfo);
			}

			callback(null, lessText, href, newFileInfo, { lastModified: new Date() });
		} catch (e) {
			callback(e, null, href);
		}
	};
}

module.exports = function(app) {
	function compileLess(srcCode, options, callback) {
		var parserOptions = _.pick(options, lessOptions.parse);
		parserOptions.javascriptEnabled = false;

		if (!parserOptions.filename) {
			parserOptions.filename = 'style.less';
		}

		less.Parser.fileLoader = fileLoader(options);
		var parser = new less.Parser(parserOptions);
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
