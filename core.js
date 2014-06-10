#!/usr/bin/env node
 
 
var osc = require('node-osc');
var oscServer = new osc.Server(8000, '0.0.0.0');
var OPC = new require('./opc');
var model = OPC.loadModel(process.argv[2] || '/home/pi/fadecandy/examples/layouts/strip230n.json');  // layout generated using https://github.com/scanlime/fadecandy/tree/master/examples/layouts
var client = new OPC('localhost', 7890);
 

 // effect 1 (strip fade) 
var red1 = 255;
var green1 = 255;
var blue1 = 255;
var fall = 0;

// strobe
var strobeON = 0;
var sdelay = 0;

// effect 2 (particle) source: https://github.com/scanlime/fadecandy/blob/master/examples/node/particle_touchosc.js
var stateAngle1 = 0;
var stateAngle2 = 0;
var hue = 0.3;
var hueShift = 0.8;
var saturation = 0.5;
var brightness = 0.5;
var falloff = 0.5;
var rate1 = 0.1;
var rate2 = 0.2;
var particleON = 0;


 
 
oscServer.on('message', function (msg, rinfo) {
 
    // Show the message, for debugging
    console.log(msg);
 
 
// strobe 
if (msg[0] == '/5/STROB') strobeON = msg[1];
if (msg[0] == '/5/SDELAY') sdelay = msg[1];
 
// effect 1 (strip fade) + strobe
if (msg[0] == '/1/RED') red1 = msg[1];
if (msg[0] == '/1/GREEN') green1 = msg[1];
if (msg[0] == '/1/BLUE') blue1 = msg[1];
if (msg[0] == '/1/FALLOFF') fall = msg[1];

// effect 2 (particle)
if (msg[0] == '/4/hue') hue = msg[1];
if (msg[0] == '/4/hueShift') hueShift = msg[1];
if (msg[0] == '/4/saturation') saturation = msg[1];
if (msg[0] == '/4/falloff2') falloff = msg[1];
if (msg[0] == '/4/brightness') brightness = msg[1];
if (msg[0] == '/4/particleON') particleON = msg[1];
if (msg[0] == '/4/xy1') { // XY pad, oscillator rates
        rate1 = msg[1];
        rate2 = msg[2];
    }
});
 
 
function draw() {
    if (strobeON == 1) { // Button Strobe is pressed
     //   console.log('do strobe');
        doStrobe(function(){
            setTimeout(draw,30); // repeat
        });
        
    }   else if  (particleON == 1) { // Button Particle is toggled ON
      //  console.log('particle ON');
        doParticles(function(){
            setTimeout(draw,30); // repeat
        });     
    }   else {
        doFall(function(){
            setTimeout(draw,30); // repeat
        });
    }
}
 
 
 
 
 function doParticles(callback) {

    var numParticles = 230;
    var particles = [];

    var trail = 100.0;
    var scaledRate1 = (rate1 - 0.4) * 0.4;
    var scaledRate2 = (rate2 - 0.4) * 0.4;
    stateAngle1 += scaledRate1;
    stateAngle2 += scaledRate2;

    for (var i = 0; i < numParticles; i++) {
        var s = i / numParticles;

        // Local state angles for this particle
        var lsa1 = stateAngle1 + scaledRate1 * trail * s;
        var lsa2 = stateAngle2 + scaledRate2 * trail * s;

        // Compute position, this gives us the shape of our effect.
        var radius = 0.1 + 2.0 * s;
        var x = radius * Math.cos(lsa1);
        var y = radius * Math.sin(lsa2);

        particles[i] = {
            point: [x, 0, y],
            intensity: brightness * (1 - s),
            falloff: falloff * 175,
            color: OPC.hsv( hue + s * 2.0 * (hueShift - 0.5), saturation, 0.5)
        };
    }

    client.mapParticles(particles, model);
    callback();
}
 
 
 
 
 
function doFall(callback) {
    var millis = new Date().getTime();
    for (var pixel = 0; pixel < 230; pixel++) {
        var t = pixel * 0.2 + millis * 0.002,
            red = red1 + fall * Math.sin(t),
            green = green1 + fall * Math.sin(t + 0.1),
            blue = blue1 + fall * Math.sin(t + 0.3);
 
        client.setPixel(pixel, red, green, blue);
    }
    client.writePixels();
    callback();
}
 
function doStrobe(callback) {
 
    if (strobeON != 1) {
        return;
    }
 
  //  setPixels(255,255,255); // white
    setPixels(red1,green1,blue1); // set params from OSC

    setTimeout(function(){
        setPixels(0,0,0); // black
 
        setTimeout(callback,sdelay/*delay after black*/);
 
    }, 10/*delay after white*/);
}
 
function setPixels(r,g,b) {
    for (var pixel = 0; pixel < 230; pixel++) {
        client.setPixel(pixel, r, g, b);
    }
    client.writePixels();
}

 
draw();
