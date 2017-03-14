# FIT3140 Group 73 Assignment 1 Task 1
Group members: Patrick Zhang, Aidan Majewski

The program reads data from the motion sensor and blinks the LED with each new Input. The program was written in Arduino IDE. 

Requirements:
  - Arduino IDE installed
  - An Arduino UNO with johnny-five configured, an LED connected to pin 13, and a motion sensor connected to pin 2

Known Limitations:
  - Depending on the settings on the sensor itself (the two physical dials), the detection may be more / less sensitive and delay in detection may increase / decrease
  - The motion sensor can only resume detection after 5 seconds has passed after detection (when the LED is off)