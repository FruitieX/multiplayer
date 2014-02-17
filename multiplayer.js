#!/usr/bin/env node

var io = require('socket.io').listen(8080);
var sys = require('sys');
var exec = require('child_process').exec;

io.sockets.on('connection', function(socket) {
	socket.on('keydown', function(data) {
		console.log("keydown");
		exec("xdotool keydown a");
	});
	socket.on('keyup', function(data) {
		console.log("keyup");
		exec("xdotool keyup a");
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
