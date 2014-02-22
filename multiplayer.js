#!/usr/bin/env node

var io = require('socket.io').listen(1338, { log: false });
var sys = require('sys');
var exec = require('child_process').exec;

// how many seconds before RNG kicks in
/*
var rngTimerSeconds = 10;
// wait until rngTimerSeconds from last player input
var rngTimer;
// repeats RNG keypresses
var rngInterval;
*/
/* 1-med-low var highKeys = ['A'];
var med = 0.50; var medKeys = ['Up', 'Down', 'Left', 'Right', 'B'];
var low = 0.05; var lowKeys = ['Start', 'Select'];
var choose = function(a) {
	return a[Math.floor(Math.random() * a.length)];
};

var setRngTimer = function() {
	clearInterval(rngInterval);
	rngTimer = setTimeout(function() {
		rngInterval = setInterval(function() {
		},)
	}, rngTimerSeconds * 1000);
};
*/

// safety first :>
var getKey = function(data) {
	switch(data) {
		case 'Up': return '111';
		case 'Down': return '116';
		case 'Left': return '113';
		case 'Right': return '114';
		case 'A': return '61';
		case 'B': return '56';
		case 'Start': return '36';
		case 'Select': return '22';
		default: return;
	}
};

var keyPress = function(data) {
	console.log(data);
	exec("xdo keypress -k " + getKey(data));
};

var keyRelease = function(data) {
	exec("xdo keyrelease -k " + getKey(data));
};

io.sockets.on('connection', function(socket) {
	socket.on('keyPress', function(data) {
		keyPress(data);
	});
	socket.on('keyRelease', function(data) {
		keyRelease(data);
	});
});

// serve a nice webpage on port 8000
var static = require('node-static');

var file = new static.Server('./static');

require('http').createServer(function(req, res) {
	req.addListener('end', function () {
		file.serve(req, res);
	}).resume();
}).listen(1337);
