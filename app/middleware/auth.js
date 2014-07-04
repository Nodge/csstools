var RateLimiter = require('limiter').RateLimiter;

module.exports = function(app, router) {
	router || (router = app);

	var rates = {};

	router.use(function(req, res, next) {
		var access_token = req.param('access_token'),
			client_id = null,
			plans = app.clients.plans,
			client_plan = app.clients.defaultPlan,
			err;

		if (access_token) {
			if (!app.clients.tokens.hasOwnProperty(access_token)) {
				return res.badRequest(app.ERROR_INVALID_ACCESS_TOKEN, 'Invalid or expired access_token.');
			}

			var token = app.clients.tokens[access_token];

			var now = Date.now();
			if (now > token.expires.getTime()) {
				return res.badRequest(app.ERROR_INVALID_ACCESS_TOKEN, 'Invalid or expired access_token.');
			}

			client_id = access_token;
			client_plan = token.plan;
			req.client_token = token;
		}
		else {
			client_id = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
		}

		req.client_plan = plans[client_plan];

		if (!rates[client_id]) {
			// Also understands 'second', 'minute', 'day', or a number of milliseconds
			rates[client_id] = new RateLimiter(req.client_plan.requests, req.client_plan.period);
		}

		if (rates[client_id].getTokensRemaining() >= 1) {
			rates[client_id].removeTokens(1, function(err, remainingRequests) {
				next(err);
			});
		}
		else {
			err = app.createError(app.ERROR_RATE_LIMIT_EXCEEDED, 'Too Many Requests - your IP/token is being rate limited.');
			res.sendError(err, 429, 'Too Many Requests.');
		}
	});
};