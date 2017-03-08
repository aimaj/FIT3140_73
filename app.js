function IotDevice(socket) {
	// A class that sets up the board with johnny five, and provides methods to toggle the LED and the motion detector components
	var five = require("johnny-five");
	var board = new five.Board();
	var startTime, endTime, numMotions, longMotions, shortMotions = 0;
	var led, motion;
	var motionEnabled = true;
	this.toggleMotion = function() {
		 if (motionEnabled == true) {
			 motionEnabled = false;
		 } else {
			 motionEnabled = true;
		 }
	};
	board.on("ready", function() {
		led = new five.Led(13);
		motion = new five.Motion(2)
		
		motion.on("calibrated", function() {
	    		console.log("Board calibrated, please connect to localhost:8080");
	  	});
	
	  	motion.on("motionstart", function() {
			if (motionEnabled == true) {
				console.log("Start of motion detected");
				socket.emit('numMotions', ++numMotions);
				startTime = Date.now();
			} else {
				startTime = 0;
			}
	  	});
	
	 	motion.on("motionend", function() {
	    	if (motionEnabled == true && startTime != 0) {
				endTime = Date.now();
				if ((endTime - startTime < 6000)) {
					//a short motion here is defined as less than 6 seconds
					socket.emit('shortMotions', ++shortMotions);
					console.log("Finished detecting, short motion");
				} else {
					//a long motion is anything longer than 6 seconds
					socket.emit('longMotions', ++longMotions);
					console.log("Finished detecting, long motion");
				}
			}
	  	});
	});
	
	this.toggleLED = function() {
		led.toggle();
	}	
}

var fs =require('fs')
         , http=require('http')
         , socketio=require('socket.io');

var server=http.createServer(function(req, res) {
            res.writeHead(200, { 'Content-type': 'text/html'});
            res.end(fs.readFileSync(__dirname+'/index.html'));
            }).listen(8080, function() {
 });

var socket = socketio.listen(server).on('connection', function (socket) {
		//create a socket to allow client/server communications
		socket.on('message', function (msg) {
		 if (msg == "toggleLED") {
			arduino.toggleLED();
			console.log('Toggling the LED');
		 }
		 if (msg == "toggleMotion") {
			arduino.toggleMotion();
			console.log('Toggling the motion detector');
		 }
 });
});

// can cause crashing if accessed before fully loaded, arduino takes socket as arg but socket uses arduino methods...
var arduino = new IotDevice(socket);
