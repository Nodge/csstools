// Include the cluster module
var cluster = require('cluster');
var config = require('./app/config/config');
var port = process.env.PORT || config.port;

if (cluster.isMaster) {
	// Code to run if we're in the master process

	// Count the machine's CPUs
	// Create a worker for each CPU
	for (var i = 0; i < config.threads; i += 1) {
		cluster.fork();
	}

	console.log("App listening on port " + port);
}
else {
	// Code to run if we're in a worker process

	require('./app/app.js')(port);

	console.log('Worker ' + cluster.worker.id + ' running!');
}

// Listen for dying workers
cluster.on('exit', function (worker) {
	// Replace the dead worker,
	// we're not sentimental
	console.log('Worker ' + worker.id + ' died :(');
	cluster.fork();
});