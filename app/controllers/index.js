var express = require('express');

module.exports = function(app) {
	var router = express.Router();

	router.get('/', function (req, res) {
		res.redirect('https://github.com/Nodge/csstools');
	});

	return router;
};


