
int ledPin = 13;                          // choose the pin for the LED
int inputPin = 2;                         // choose the input pin (for PIR sensor)
int pirState = LOW;                       // assume no motion detected at the start
int val = 0;                              // variable for reading the pin status



void setup() {
  
  pinMode(ledPin, OUTPUT);                // declare LED as output
  pinMode(inputPin, INPUT);               // declare sensor as input

  Serial.begin(9600);
}

void loop() {
  val = digitalRead(inputPin);            // reads input value
  if (val == HIGH) {                      // check if input is HIGH
    // we have just turned on
    digitalWrite(ledPin, HIGH);           // turn LED on
    Serial.println("Motion detected"); 
    // we only want to print on the output change, not state  
    pirState = HIGH;
} else {
  digitalWrite(ledPin, LOW);              // turn LED off
  if (pirState == HIGH){
    // we have just turned off
    Serial.println("Motion ended");
    // we only want to print output change, not state
    pirState = LOW;
  } 
}}
