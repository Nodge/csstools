var _ = require('underscore');
var express = require('express');

module.exports = function (port) {
	var app = express();
	_.extend(app, require('./config/errorCodes'));
	app.config = require('./config/config');
	app.clients = require('./config/clients');

	/**
	 *
	 * @param code
	 * @param message
	 */
	app.createError = function(code, message) {
		var err = new Error(message);
		err.code = code;
		return err;
	};

	/**
	 *
	 * @param code
	 * @param msg
	 * @returns {*}
	 */
	app.response.badRequest = function(code, msg) {
		return this.sendError(app.createError(code, msg), 400, 'Bad request.');
	};

	/**
	 *
	 * @param error
	 * @param statusCode
	 * @param statusText
	 * @returns {*}
	 */
	app.response.sendError = function(error, statusCode, statusText) {
		if (!statusCode && !error.code) {
			statusCode = 500;
		}

		if (statusCode) {
			this.statusCode = statusCode;
		}
		if (statusText) {
			this.statusText = statusCode + ' ' + statusText;
		}

		return this.json({
			code: error.code ? error.code : 500,
			error: error.message
		});
	};

	// Include controllers
	app.use('/', require('./controllers/index')(app));
	app.use('/', require('./controllers/api')(app));

	app.listen(port);
};