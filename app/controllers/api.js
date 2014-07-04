var express = require('express');
var _ = require('underscore');
var async = require('async');

module.exports = function(app) {
	var supportedTools = {
		less: require('../tools/less')(app),
		autoprefixer: require('../tools/autoprefixer')(app)
	};
	var toolsAvailable = _.pick(supportedTools, app.config.enabledTools);
	var router = express.Router();

	require('../middleware/bodyParser')(app, router);
	require('../middleware/auth')(app, router);

	/**
	 * Compile css endpoint
	 */
	router.post('/compile', function (req, res) {
		if (req.get('content-type') !== 'application/json') {
			return res.badRequest(app.ERROR_API_CONTENT_TYPE, 'Content-type should be "application/json".');
		}

		if (!req.body.hasOwnProperty('css')) {
			return res.badRequest(app.ERROR_CSS_PROP_NOT_SET, 'The "css" property is required.');
		}

		if (!req.body.hasOwnProperty('tools')) {
			return res.badRequest(app.ERROR_TOOLS_PROP_NOT_SET, 'The "tools" property is required.');
		}

		if (!_.isArray(req.body.tools)) {
			return res.badRequest(app.ERROR_TOOLS_SHOULD_BE_ARRAY, 'The "tools" property should be array.');
		}

		var tools = req.body.tools;

		for (var i = 0; i < tools.length; i++) {
			if (!toolsAvailable.hasOwnProperty(tools[i])) {
				return res.badRequest(app.ERROR_UNKNOWN_TOOL, 'Unknown tool: ' + tools[i] + '. This tool is not supported.');
			}

			if (req.client_plan.allowedTools && req.client_plan.allowedTools.indexOf(tools[i]) < 0) {
				return res.badRequest(app.ERROR_DISABLED_TOOL, 'The ' + tools[i] + ' tool is not available in your plan.');
			}
		}

		var css = req.body.css;
		if (!css.trim()) {
			return res.json({ code: 0, css: css });
		}

		async.eachSeries(tools, function(toolName, nextTool) {
			var options = {};
			if (req.body.options && req.body.options[toolName]) {
				options = req.body.options[toolName];
			}

			var processor = toolsAvailable[toolName];
			processor(css, options, function(err, processedCss) {
				css = processedCss;
				nextTool(err);
			});
		}, function(err) {
			if (err) {
				res.sendError(err);
			}
			else {
				res.json({ code: 0, css: css });
			}
		});
	});

	/**
	 * Tools versions endpoint
	 */
	router.get('/versions', function (req, res) {
		var versions = {};
		_.each(toolsAvailable, function(tool, toolName) {
			if (req.client_plan.allowedTools && req.client_plan.allowedTools.indexOf(toolName) < 0) {
				return;
			}
			versions[toolName] = tool.VERSION;
		});
		res.json({ code: 0, versions: versions });
	});

	/**
	 * Check access token endpoint
	 */
	router.post('/checkToken', function (req, res) {
		var token = req.client_token;
		if (!token) {
			token = { plan: app.clients.defaultPlan };
		}
		token.plan = app.clients.plans[token.plan];
		if (!token.plan.allowedTools) {
			token.plan.allowedTools = _.keys(toolsAvailable);
		}
		res.json(token);
	});

	return router;
};