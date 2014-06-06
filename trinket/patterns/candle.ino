#include <Adafruit_NeoPixel.h>

#define PIN 0
#define PIX 16
// Parameter 1 = number of pixels in candle
// Parameter 2 = pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
Adafruit_NeoPixel candle = Adafruit_NeoPixel(PIX, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  candle.begin();  
  candle.show(); // Initialize all pixels to 'off'
}

void loop() {
  // args are flicker position, brightness and, flicker time
  // ?? can we force this into a normal curve?
  neoFlame(random(100), random(60,200), random(150,300));
}

void neoFlame(uint8_t pos, uint8_t brite, uint8_t wait){
 
 // first px usually blue, sometimes white
 if (random(100) <75) {
   candle.setPixelColor(0, candle.Color(0,8,16));
 } else {
   candle.setPixelColor(0, candle.Color(16,16,16));
 }
 
 // second px usually blue, sometimes orange
 if (pos < 75 ) {
   candle.setPixelColor(1, candle.Color(0,8,16));
 } else {
   candle.setPixelColor(1, candle.Color(16,8,0));
 }
 
 // next three px are orange
 candle.setPixelColor(2, candle.Color(16,8,0));
 candle.setPixelColor(3, candle.Color(16,8,0));
 candle.setPixelColor(4, candle.Color(16,8,0));
 
 // border px usually orange, sometimes yellow
 if (pos < 75) {
  candle.setPixelColor(5, candle.Color(16,8,0));  
 } else{
  candle.setPixelColor(5, candle.Color(16,16,0));
 }
 
 // last two px are yellow
 candle.setPixelColor(6, candle.Color(16,16,0));  
 candle.setPixelColor(7, candle.Color(16,16,0));  
 candle.setPixelColor(8, candle.Color(16,16,0));  
 candle.setPixelColor(9, candle.Color(16,16,0)); 
 candle.setPixelColor(10, candle.Color(16,16,0));  
 candle.setPixelColor(11, candle.Color(16,16,0));   
 candle.setPixelColor(12, candle.Color(16,16,0));  
 candle.setPixelColor(13, candle.Color(16,16,0));
 candle.setPixelColor(14, candle.Color(16,16,0));  
 candle.setPixelColor(15, candle.Color(16,16,0));   
 
 candle.setBrightness(brite);
 candle.show();
 delay(wait);
}
