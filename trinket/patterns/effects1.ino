#include <Adafruit_NeoPixel.h>
#ifdef __AVR_ATtiny85__ // Trinket, Gemma, etc.
#include <avr/power.h>
#endif

#define PIN 0

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(16, PIN, NEO_GRB + NEO_KHZ800);

// IMPORTANT: To reduce NeoPixel burnout risk, add 1000 uF capacitor across
// pixel power leads, add 300 - 500 Ohm resistor on first pixel's data input
// and minimize distance between Arduino and first pixel.  Avoid connecting
// on a live circuit...if you must, connect GND first.



void setup() {
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  strip.setBrightness(255); // 1/3 brightness
   randomSeed(analogRead(2)); 
  


}

void loop() {
oneLedRandomBlink(); // one random pixel blink
//sync(500); // delay for synchronization
theaterChaseRainbow1(); // delay, one pixel spin, rainbow colours
//sync(500); // delay for synchronization
twoLedRandomBlink2(); // two random pixel blink
//sync(500); // delay for synchronization
randomTwoPixelsSpin(); // delay, repeat times (200+400=~1m30sec)
//sync(500); // delay for synchronization
twoLedRandomBlink2();
//sync(500); // delay for synchronization
theaterChaseRainbow2(); // two pixels spin, rainbow colours
//sync(500); // delay for synchronization
oneLedRandomBlink();
//sync(500); // delay for synchronization
halfSpin();
//sync(500); // delay for synchronization
twoLedRandomBlink2(); 
//sync(500); // delay for synchronization
theaterChaseRainbow5();
//sync(500); // delay for synchronization
rainbow(); // glow rainbow spin  
rainbowCycle(1);
}  

void sync(uint32_t ms) {
  delay(ms);
}
  

void oneLedRandomBlink() {
for (byte T=0; T < 40; T++){
    byte B=random(255);
    byte R=random(255);
    byte G=random(255);
  for (byte T=0; T < 10; T++){
    byte p=random(16);
    strip.setPixelColor(p,R,G,B);

  strip.show();
  delay(79);

      strip.setPixelColor(p, 0);        //turn every 'int p' pixel off
       } 
    }
}

void twoLedRandomBlink2() {
for (byte T=0; T < 21; T++){
    byte B=random(255);
    byte R=random(255);
    byte G=random(255);
  for (byte T=0; T < 10; T++){
    byte p=random(16);
    strip.setPixelColor(p,R,G,B);
    strip.setPixelColor(p+8,R,G,B);

  strip.show();
  delay(79);

      strip.setPixelColor(p, 0);        //turn every p pixel off
      strip.setPixelColor(p+8, 0);        //turn every p pixel off
    } 
  }
}


//Half Spin Random 
void halfSpin() { // wait = delay ms, times = loop cycles
 
  
  for (byte T=0; T < 60; T++) { 
    // initialise spin from right to left  
  byte R=random(255); // random RED
  byte G=random(255); // ramdom GREEN
  byte B=random(255); // random BLUE
  for (byte p=0; p < 16; p++) { // p = dot positions (0-16)
    strip.setPixelColor(p,R,G,B); // set position and colors
  strip.show(); // on pixel
  delay(20);
   }
   for (byte p=0; p < 16; p++) {
    strip.setPixelColor(p,0); // set blank
  strip.show(); // turn pixel off
  delay(20);
  }
  // initialise spin from left 
  byte Ro=random(255);
  byte Go=random(255);
  byte Bo=random(255);
  for (char p=16; p > -1; p=p-1) {
    strip.setPixelColor(p,Ro,Go,Bo);
  strip.show();
  delay(20);
   }
  for (char p=16; p > -1; p=p-1) {
    strip.setPixelColor(p,0);
  strip.show();
  delay(20);
  }
 }
}

// Led Random Blink 

  
  // 1 Led Random Spin
void oneLedRandomSpin(uint8_t wait, uint8_t times) { // T = how many times repeat, p = position
  for (byte T=0; T < times; T++){
    byte R=random(255);
    byte G=random(255);
    byte B=random(255);
    for (byte p=0; p< strip.numPixels(); p++) {
    strip.setPixelColor(p,R,G,B);
    
    
   strip.show();
   delay(wait);
   strip.setPixelColor(p, 0);        //turn every pixel off
    }
  }
}
  

//Theatre-style crawling lights.
void theaterChase(uint8_t c, uint8_t wait) {
  for (byte j=0; j<10; j++) {  //do 10 cycles of chasing
    for (byte q=0; q < 3; q++) {
      for (byte i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, c);    //turn every third pixel on
      }
      strip.show();
     
      delay(wait);
     
      for (byte i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}

//Theatre-style crawling 1 light with rainbow effect
void theaterChaseRainbow1() {
  for (byte j=0; j < 255; j++) {     // cycle all 256 colors in the wheel
    for (byte q=0; q < 16; q++) {   // set position
        for (byte i=0; i < strip.numPixels(); i=i+10) {
          strip.setPixelColor(q, Wheel( (i+j) % 255));    //turn every  pixel on
         
        }
    
        strip.show();
       
        delay(14);
       
        for (byte i=0; i < strip.numPixels(); i=i+3) {
          strip.setPixelColor(i+q, 0);        //turn every third pixel off
        }
       
    }
  }
}


//Theatre-style crawling 2 lights with rainbow effect
void theaterChaseRainbow2() {
  for (byte j=0; j < 255; j++) {     // cycle all 256 colors in the wheel
    for (byte q=0; q < 8; q++) {   // set position
        for (byte i=0; i < strip.numPixels(); i=i+10) {
          strip.setPixelColor(q, Wheel( (i+j) % 255));    //turn every  pixel on
          strip.setPixelColor(q+8, Wheel( (i+j) % 255));    //turn every  pixel on
        }
    
        strip.show();
       
        delay(26);
       
        for (byte i=0; i < strip.numPixels(); i=i+3) {
          strip.setPixelColor(q+8, 0);        //turn every third pixel off
          strip.setPixelColor(i+q, 0);        //turn every third pixel off
        }
       
    }
  }
}


//randomTwoPixelsSpin
void randomTwoPixelsSpin() {
   for (byte T=0; T < 200; T++) {
     
    byte R=random(255);
    byte G=random(255);
    byte B=random(255);
  
    for (byte q=0; q < 8; q++) {
        for (byte i=0; i < strip.numPixels(); i++) {
          strip.setPixelColor(q,R,G,B);    //turn every  pixel on
          strip.setPixelColor(q+8,R,G,B);   //turn every  pixel on

        }
    
        strip.show();
       
        delay(25);
       
          strip.setPixelColor(q, 0);        //turn q pixel off
          strip.setPixelColor(q+8, 0);        //turn q+8 pixel off   
   }
 }

   for (byte T=0; T < 100; T++) {
     
    byte R=random(255);
    byte G=random(255);
    byte B=random(255);
  
    for (char q=8; q > -1; q=q-1) { 
        for (byte i=0; i < strip.numPixels(); i++) {
          strip.setPixelColor(q,R,G,B);    //turn q  pixel on
          strip.setPixelColor(q+8,R,G,B);   //turn q+8  pixel on

        }
    
        strip.show();
       
        delay(25);
       
          strip.setPixelColor(q, 0);        //turn q pixel off
          strip.setPixelColor(q+8, 0);        //turn q+8 pixel off     
   }
  }
}

//Theatre-style 5 lights with rainbow effect
void theaterChaseRainbow5() {
  for (byte j=0; j < 255; j++) {     // cycle all 256 colors in the wheel
    for (byte q=0; q < 3; q++) {
        for (byte i=0; i < strip.numPixels(); i=i+3) {
          strip.setPixelColor(i+q, Wheel( (i+j) % 255));    //turn every third pixel on
        }
        strip.show();
       
        delay(52);
       
        for (byte i=0; i < strip.numPixels(); i=i+3) {
          strip.setPixelColor(i+q, 0);        //turn every third pixel off
        }
    }
  }
}

void rainbow() {
  uint8_t i, j;

  for(j=0; j<255; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(300);
  }
}

void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256*5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}


// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  if(WheelPos < 85) {
   return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
  } else if(WheelPos < 170) {
   WheelPos -= 85;
   return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  } else {
   WheelPos -= 170;
   return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
}

