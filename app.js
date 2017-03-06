var ledFlag = 0;
var http = require('http');

var motionNumber = 0;

var five = require("johnny-five");
var myBoard, myLed;

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
		   myLed.toggle();
		   
 });
});

//end server code

//arduino code, to be moved into separate class

myBoard = new five.Board();

myBoard.on("ready", function() {

  //var motion = new five.Motion(2);
  myLed = new five.Led(13);
  
/**
  motion.on("calibrated", function() {
    console.log("calibrated");
  });

  motion.on("motionstart", function() {
    console.log("motionstart");
	
  myLed.on();
  });

  motion.on("motionend", function() {
    console.log("motionend");
	motionNumber++
  myLed.off();
  });
**/

  // make myLED available as "led" in REPL

  // try "on", "off", "toggle", "strobe", "stop" (stops strobing)

  this.repl.inject({
    led: myLed
  });
  console.log("You can interact with the RGB LED via the variable 'led' e.g. led.on();\n Hit control-D to exit.\n >> ");
});

