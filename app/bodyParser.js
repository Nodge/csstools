module.exports = function(app) {
	var bodyParser = require('body-parser');

	// parse application/x-www-form-urlencoded
	//app.use(bodyParser.urlencoded());

	// parse application/json
	app.use(bodyParser.json());
	app.use(function(err, req, res, next) {
		// Catch json error
		if (err) {
			res.statusCode = err.status;
			res.json({
				code: 5,
				error: err.message
			});
		}
		next(err);
	});

	// parse application/vnd.api+json as json
	//app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
};