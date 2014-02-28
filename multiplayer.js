#!/usr/bin/env node

var io = require('socket.io').listen(1338, { log: false });
var sys = require('sys');
var exec = require('child_process').exec;
var clc = require('cli-color');

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
		case 'A': return '56';
		case 'B': return '61';
		case 'C': return '38';
		case 'D': return '39';
		case 'Start': return '36';
		case 'Select': return '22';
		default: return;
	}
};

var keyPress = function(data) {
	var date_string = new Date().toTimeString().split(' ')[0] + ' ';
	console.log(date_string + data);
	exec("xdo keypress -k " + getKey(data));
	io.sockets.emit('keyPress', data);
	setTimeout(function() {
		exec("xdo keyrelease -k " + getKey(data));
	}, 100);
};

var keyRelease = function(data) {
	//exec("xdo keyrelease -k " + getKey(data));
	io.sockets.emit('keyRelease', data);
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

// clear the terminal
process.stdout.write('\u001B[2J\u001B[0;0f');

require('http').createServer(function(req, res) {
	req.addListener('end', function () {
		file.serve(req, res);
	}).resume();
}).listen(1337);

process.on('uncaughtException', function (err) {
	console.error(err.stack);
	console.log("ERROR! Node not exiting.");
});
