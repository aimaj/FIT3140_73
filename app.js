function IotDevice(socket) {
	// A class that sets up the board with johnny five, and provides methods to toggle the LED and the motion detector components
	var five = require("johnny-five");
	var board = new five.Board();
	// Initialise variables
	var numMotions = 0;
	var longMotions = 0;
	var shortMotions = 0;
	var startTime = 0;
	var endTime = 0;
	var led, motion;
	//flag to represent when the motion detector is on or off
	var motionEnabled = true;
	// A function to toggle the motion detector
	this.toggleMotion = function() {
		 if (motionEnabled == true) {
			 motionEnabled = false;
		 } else {
			 motionEnabled = true;
		 }
	};
	board.on("ready", function() {
		//set up a johnny-five motion device
		//the led at pin 13
		led = new five.Led(13);
		//the motion detector at pin 2
		motion = new five.Motion(2)
		
		motion.on("calibrated", function() {
	    		console.log("Board calibrated, please connect to localhost:8080");
	  	});
	
	  	motion.on("motionstart", function() {
			//if the motion detector is enabled
			if (motionEnabled == true) {
				//increment the number of motions counted and record the start time
				console.log("Start of motion detected");
				socket.emit('numMotions', ++numMotions);
				startTime = Date.now();
			} else {
				//if the motion detector is off, make start time 0
				startTime = 0;
			}
	  	});
	
	 	motion.on("motionend", function() {
			//if the motion detector is enabled, and the start time is not zero (meaning this current motion did not start when the detector was off)
	    	if (motionEnabled == true && startTime != 0) {
				//record the end time, and calculate the motion length
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
	// a function to toggle the LED
	this.toggleLED = function() {
		led.toggle();
	}	
}

var fs =require('fs')
         , http=require('http')
         , socketio=require('socket.io');

//set up the server on port 8080
var server=http.createServer(function(req, res) {
            res.writeHead(200, { 'Content-type': 'text/html'});
            res.end(fs.readFileSync(__dirname+'/index.html'));
            }).listen(8080, function() {
 });

var socket = socketio.listen(server).on('connection', function (socket) {
		//create a socket to allow client/server communications
		socket.on('message', function (msg) {
		 //the toggleLED message toggles the arduino led
		 if (msg == "toggleLED") {
			arduino.toggleLED();
			console.log('Toggling the LED');
		 }
		 //the toggleMotion message toggles the motion detector flag
		 if (msg == "toggleMotion") {
			arduino.toggleMotion();
			console.log('Toggling the motion detector');
		 }
 });
});

//create a new IotDevice according to the definitions declared above
var arduino = new IotDevice(socket);
