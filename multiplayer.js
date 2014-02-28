#!/usr/bin/env node

var io = require('socket.io').listen(1338, { log: false });
var sys = require('sys');
var exec = require('child_process').exec;
var clc = require('cli-color');
var _ = require('underscore');

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

// need to keep track of these so we can handle left+right/up+down situationS
var buttons = ['Up', 'Left', 'Right', 'Down', 'A', 'B', 'C', 'D', 'Select', 'Start'];
var buttons_keycodes = [111, 116, 114, 116, 56, 61, 38, 39, 22, 36];
var buttons_pressed = [false, false, false, false, false, false, false, false, false, false];

var checkButton = function(eventname, keyname) {
	var key = getKey(keyname);
	if (eventname == 'keyPress') {
		if (buttons_pressed[key] == false) {
			buttons_pressed[key] = true;
			exec("xdo keypress -k " + buttons_keycodes[key]);
			io.sockets.emit('keyPress', keyname);
		}
	}
	else if (eventname == 'keyRelease') {
		if (buttons_pressed[key] == true) {
			buttons_pressed[key] = false;
			exec("xdo keyrelease -k " + buttons_keycodes[key]);
			io.sockets.emit('keyRelease', keyname);
		}
	}
}

var getKey = function(keyname) {
	switch(keyname) {
		case 'Up': return 0;
		case 'Down': return 3;
		case 'Left': return 1;
		case 'Right': return 2;
		case 'A': return 4;
		case 'B': return 5;
		case 'C': return 6;
		case 'D': return 7;
		case 'Start': return 9;
		case 'Select': return 8;
		default: return;
	}
};

var keyPress = _.throttle(function(keyname) {
	var date_string = new Date().toTimeString().split(' ')[0] + ' ';
	console.log(date_string + key);

	checkButton('keyPress', getKey(keyname));
	/*
	setTimeout(function() {
		exec("xdo keyrelease -k " + getKey(data));
		io.sockets.emit('keyRelease', data);
	}, 100);
	*/
}, 200);

var keyRelease = function(keyname) {
	checkButton('keyRelease', getKey(keyname));
};

io.sockets.on('connection', function(socket) {
	socket.on('keyPress', function(keyname) {
		keyPress(keyname);
	});
	socket.on('keyRelease', function(keyname) {
		keyRelease(keyname);
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
