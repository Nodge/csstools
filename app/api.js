var express = require('express');
var _ = require('underscore');
var async = require('async');
var router = express.Router();

var tools = {
	less: require('./tool_less.js'),
	autoprefixer: require('./tool_autoprefixer.js')
};

require('./auth.js')(router);

router.post('/compile', function (req, res) {
	if (!req.body.hasOwnProperty('css')) {
		res.badRequest(1, '"css" property is not set');
	}

	if (!req.body.hasOwnProperty('tools')) {
		res.badRequest(2, '"tools" property is not set');
	}

	if (!_.isArray(req.body.tools)) {
		res.badRequest(3, '"tools" property should be array of strings');
	}

	var css = req.body.css;
	if (css.trim()) {
		async.eachSeries(req.body.tools, function(toolName, nextTool) {
			var options = {};
			if (req.body.options && req.body.options[toolName]) {
				options = req.body.options[toolName];
			}
			runTool(css, toolName, options, function(err, processedCss) {
				css = processedCss;
				nextTool(err);
			});
		}, function(err) {
			if (err) {
				res.json({
					code: err.code,
					css: err.message
				});
			}
			else {
				res.json({
					code: 0,
					css: css
				});
			}
		});
	}
});

function runTool(css, toolName, options, nextTool) {
	if (!tools.hasOwnProperty(toolName)) {
		var err = new Error();
		err.message = 'Unknown tool: ' + toolName;
		err.code = 4;
		nextTool(err);
	}

	tools[toolName](css, options, nextTool);
}

module.exports = router;