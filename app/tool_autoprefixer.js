var autoprefixer = require('autoprefixer');
var _= require('underscore');

var autoprefixerOptions = [
	'browsers',
	'cascade'
];

function compileCss(srcCode, options, callback) {
	options = _.pick(options, autoprefixerOptions);
	try {
		var prefixer = autoprefixer(options.browsers, {
			cascade: options.cascade
		});

		var css = prefixer.process(srcCode).css;
		callback(null, css);
	}
	catch (e) {
		var err = new Error();
		err.code = 40;
		err.message = e.message;
		callback(err, srcCode);
	}
}

module.exports = compileCss;