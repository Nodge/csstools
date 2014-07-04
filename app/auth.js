module.exports = function(app) {
	var RateLimiter = require('limiter').RateLimiter;
	var ips = {};

	// todo: whitelist IP / tokens

	app.use(function(err, req, res, next) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		if (!ips[ip]) {
			// Also understands 'second', 'minute', 'day', or a number of milliseconds
			ips[ip] = new RateLimiter(1, 'hour');
		}

		console.log(ips[ip].getTokensRemaining());

		ips[ip].removeTokens(1, function(err, remainingRequests) {
			// err will only be set if we request more than the maximum number of
			// requests we set in the constructor

console.log(err, remainingRequests);

			// remainingRequests tells us how many additional requests could be sent
			// right this moment

			if (remainingRequests < 0) {
				res.statusCode = 429;
				res.statusText = '429 Too Many Requests - your IP is being rate limited.';
				res.json({
					code: 6,
					error: 'Too Many Requests - your IP is being rate limited'
				});
			}
			else {
				next();
			}
		});
	});
};