var led;
var motion;

function IotDevice() {
	var five = require("johnny-five");
	var board = new five.Board();
	board.on("ready", function() {
		led = new five.Led(13);
		motion = new five.Motion(2)

		motion.on("calibrated", function() {
	    		console.log("calibrated");
	  	});
	
	  	motion.on("motionstart", function() {
	    		console.log("motionstart");
	  	});
	
	 	motion.on("motionend", function() {
	    		console.log("motionend");
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

socketio.listen(server).on('connection', function (socket) {
       socket.on('message', function (msg) {
           console.log('Message Received: ', msg);
           socket.broadcast.emit('message', msg);
		   //when message is received from checkbox, turn on or off the LED.
		   arduino.toggleLED();
 });
});

