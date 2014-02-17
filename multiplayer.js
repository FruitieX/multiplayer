#!/usr/bin/env node

var io = require('socket.io').listen(8080);
var sys = require('sys');
var exec = require('child_process').exec;

// safety first :>
var getKey = function(data) {
	switch(data) {
		case 'Up': return 'Up';
		case 'Down': return 'Down';
		case 'Left': return 'Left';
		case 'Right': return 'Right';
		case 'a': return 'a';
		case 'b': return 'b';
		case 'Return': return 'Return';
		case 'BackSpace': return 'BackSpace';
		default: return;
	}
};

io.sockets.on('connection', function(socket) {
	socket.on('keydown', function(data) {
		console.log("keydown " + data);
		exec("xdotool keydown " + getKey(data));
	});
	socket.on('keyup', function(data) {
		console.log("keyup " + data);
		exec("xdotool keyup " + getKey(data));
	});
});

// serve a nice webpage on port 8000
var static = require('node-static');

var file = new static.Server('./static');

require('http').createServer(function(req, res) {
	req.addListener('end', function () {
		file.serve(req, res);
	}).resume();
}).listen(8000);
