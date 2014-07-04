var bodyParser = require('body-parser');

module.exports = function(app, router) {
	router || (router = app);

	// parse application/x-www-form-urlencoded
	//app.use(bodyParser.urlencoded());

	// parse application/json
	router.use(bodyParser.json());
	router.use(function(err, req, res, next) {
		// Catch json error
		res.badRequest(app.ERROR_BODY_PARSE, err.message);
	});

	// parse application/vnd.api+json as json
	//app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
};