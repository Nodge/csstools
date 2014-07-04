function define(name, value) {
	Object.defineProperty(module.exports, name, {
		value: value,
		enumerable: true
	});
}

define('ERROR_API_CONTENT_TYPE', 1);
define('ERROR_BODY_PARSE', 2);
define('ERROR_CSS_PROP_NOT_SET', 3);
define('ERROR_TOOLS_PROP_NOT_SET', 4);
define('ERROR_TOOLS_SHOULD_BE_ARRAY', 5);
define('ERROR_UNKNOWN_TOOL', 6);
define('ERROR_RATE_LIMIT_EXCEEDED', 7);
define('ERROR_INVALID_ACCESS_TOKEN', 8);
define('ERROR_DISABLED_TOOL', 9);

define('ERROR_LESS_PARSE', 20);
define('ERROR_LESS_RENDER', 21);

define('ERROR_AUTOPREFIXER_CONFIG', 40);
define('ERROR_AUTOPREFIXER_PARSE', 41);

