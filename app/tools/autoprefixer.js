var autoprefixer = require('autoprefixer');
var _= require('underscore');

var autoprefixerOptions = [
	'browsers',
	'cascade'
];

module.exports = function(app) {
	function compileCss(srcCode, options, callback) {
		var err;
		options = _.pick(options, autoprefixerOptions);

		try {
			var prefixer = autoprefixer(options.browsers, {
				cascade: options.cascade
			});
		}
		catch (e) {
			err = app.createError(app.ERROR_AUTOPREFIXER_CONFIG, e.message);
			callback(err, srcCode);
			return;
		}

		try {
			var css = prefixer.process(srcCode).css;
			callback(null, css);
		}
		catch (e) {
			err = app.createError(app.ERROR_AUTOPREFIXER_PARSE, e.message);
			callback(err, srcCode);
		}
	}

	compileCss.VERSION = require('../../node_modules/autoprefixer/package.json').version;
	return compileCss;
};