module.exports = function (port) {
	var express = require('express');

	express.response.badRequest = function (code, msg) {
		this.statusCode = 400;
		this.json({
			code:  code,
			error: msg
		});
	};

	var app = express();

	require('./bodyParser')(app);

	app.use('/', require('./index'));
	app.use('/', require('./api'));

	app.listen(port);
};