# FIT3140 Group 73 Assignment 1 Task 2
Group members: Patrick Zhang, Aidan Majewski

A web server application that can control and monitor an IoT device with motion sensor.

This submission contains a Node server in app.js, a client in index.html, necessary dependencies in package.json and CSS in styles.css. Please note, templates were used to construct index.html and styles.css, supplied by teaching staff, but originally from Google Material Design Lite templates. Teaching staff have confirmed that these templates can be reused in the submission.

Packages:
  - socket.io
  - johnny-five

Requirements:
  - An internet connection (to download packages)
  - Node installation
  - An Arduino UNO with johnny-five configured, an LED connected to pin 13, and a motion sensor connected to pin 2

Functions and Strucutre:
  - An object called IotDevice
    - Within the IotDevice, we have some variables representing motions detected (numMotions, longMotions, shortMotions)
    - We also have two methods (toggleMotion, toggleLED) which toggle the motion sensor and LED respectively
    - We also have functions that trigger when motion is detected that sends data to the client, using the socket.io socket below
  - We declare a socket.io socket that can receive messages from the client and  will command the Arduino to perform instructions
  

Steps:
  - Clone the repository to a local directory
  - In that directory, run "npm install" to install all necessary packages defined in package.json
  - In that directory, run "node app.js" to start the server
  - When and only when the "Board calibrated, please connect to localhost:8080" message appears on the console, navigate to localhost:8080 using a web browser (preferably chrome as it has been tested in chrome)
  
Known Limitations:
  - Depending on the settings on the sensor itself (the two physical dials), the behaviour of short/long motions and motion detection may differ
  - When turning off and then on the motion sensor with the toggle, up to 5 seconds must pass without any motion in front of the detector for it to resume normal operation