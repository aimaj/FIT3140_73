var led;
var motion;

var numMotions = 0;
var motionEnabled = true;
var longMotions = 0;
var shortMotions = 0;

function IotDevice() {
	var five = require("johnny-five");
	var board = new five.Board();
	var startTime, endTime = 0;
	board.on("ready", function() {
		led = new five.Led(13);
		motion = new five.Motion(2)

		motion.on("calibrated", function() {
	    		console.log("calibrated");
	  	});
	
	  	motion.on("motionstart", function() {
			if (motionEnabled == true) {
				
			
	    		console.log("motionstart");
			socket1.emit('numMotions', ++numMotions);
			startTime = Date.now();
			}
	  	});
	
	 	motion.on("motionend", function() {
	    	if (motionEnabled == true) {
				console.log("motionend");
				
			endTime = Date.now();
			if ((endTime - startTime < 6000)) {
				
			socket1.emit('shortMotions', ++shortMotions);
	    		console.log("motionend");
			} else {
				
			socket1.emit('longMotions', ++longMotions);
	    		console.log("motionend");
			}
			}
	  	});
		this.repl.inject({
	    		led: led
 		});
	});
}

IotDevice.prototype.toggleLED = function() {
	led.toggle();
};


var ledFlag = 0;
var http = require('http');

var motionNumber = 0;

var arduino = new IotDevice();

//server code
var fs =require('fs')
         , http=require('http')
         , socketio=require('socket.io');

var server=http.createServer(function(req, res) {
            res.writeHead(200, { 'Content-type': 'text/html'});
            res.end(fs.readFileSync(__dirname+'/index.html'));
            }).listen(8080, function() {
            console.log('Listening at: http://localhost:8080');
 });

var socket1 = socketio.listen(server).on('connection', function (socket) {
       socket.on('message', function (msg) {
          	console.log('Message Received: ', msg);
         if (msg == "toggleLED") {
			 arduino.toggleLED();
		 }
         if (msg == "toggleMotion") {
			 if (motionEnabled == true) {
				 motionEnabled = false;
			 } else {
				 motionEnabled = true;
			 }
          	console.log('togglemotion');
		 }
		//when message is received from checkbox, turn on or off the LED.
		
		//socket.emit('message', num++);
 });
});

