// Include the cluster module
var cluster = require('cluster');
var config = require('./config');
var port = process.env.PORT || config.port;

if (cluster.isMaster) {
	// Code to run if we're in the master process

	// Count the machine's CPUs
	var cpuCount = require('os').cpus().length;

	// Create a worker for each CPU
	for (var i = 0; i < cpuCount; i += 1) {
		cluster.fork();
	}
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