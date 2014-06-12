#!/usr/bin/env node
 
 
var osc = require('node-osc');
var oscServer = new osc.Server(8000, '0.0.0.0');
var OPC = new require('./opc');
var model = OPC.loadModel(process.argv[2] || '/home/pi/fadecandy/examples/layouts/strip116.json');  // layout generated using https://github.com/scanlime/fadecandy/tree/master/examples/layouts
var client = new OPC('localhost', 7890);
var pixels = 230 // number of pixels in strip
 
// strobe
var strobeON = 0;
var sdelay = 0;

// effect 1 (vawes) source: https://github.com/scanlime/fadecandy/blob/master/examples/node/strip_redblue.js 
var red1 = 255;
var green1 = 255;
var blue1 = 255;
var fall = 100;

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
var particleTimeoutDelay = 30

// effect 3 (random color strobe)
var randomStrobeON = 0;
var redRandomTo = 255
var greenRandomTo = 255
var blueRandomTo = 255
var randomStrobeTimeoutDelay = 30
 
 
oscServer.on('message', function (msg, rinfo) { // take params from TouchOSC 
 
    // Show the message, for debugging
    console.log(msg);
 
 
// strobe 
if (msg[0] == '/5/STROB') strobeON = msg[1]; // button (0-1)
if (msg[0] == '/5/SDELAY') sdelay = msg[1]; // fader (0-500)
 
// effect 1 (waves)
if (msg[0] == '/1/RED') red1 = msg[1]; // fader (0-255)
if (msg[0] == '/1/GREEN') green1 = msg[1]; // fader (0-255)
if (msg[0] == '/1/BLUE') blue1 = msg[1]; // fader (0-255)
if (msg[0] == '/1/FALLOFF') fall = msg[1]; // fader (0-255)

// effect 2 (particle)
if (msg[0] == '/4/hue') hue = msg[1]; // fader (0.00001-0.99999)
if (msg[0] == '/4/hueShift') hueShift = msg[1];  // fader (0.00001-0.99999)
if (msg[0] == '/4/saturation') saturation = msg[1];  // fader (0.00001-0.99999)
if (msg[0] == '/4/falloff2') falloff = msg[1];  // fader (0.00001-0.99999)
if (msg[0] == '/4/brightness') brightness = msg[1];  // fader (0.00001-0.99999)
if (msg[0] == '/4/particleON') particleON = msg[1]; // button (0-1)
if (msg[0] == '/4/particleTimeoutDelay') particleTimeoutDelay = msg[1]; // fader (0-50)
if (msg[0] == '/4/xy1') { // XY pad, oscillator rates  (0.00001-0.99999)
        rate1 = msg[1];
        rate2 = msg[2];
    }
// effect 3 (random color strobe)    
if (msg[0] == '/6/RED') redRandomTo = msg[1]; // fader (0-255)
if (msg[0] == '/6/GREEN') greenRandomTo = msg[1]; // fader (0-255)
if (msg[0] == '/6/BLUE') blueRandomTo = msg[1]; // fader (0-255)
if (msg[0] == '/6/randomStrobeON') randomStrobeON = msg[1]; // button (0-1)
if (msg[0] == '/6/randomStrobeTimeoutDelay') randomStrobeTimeoutDelay = msg[1]; // fader (0-5000)
});
 
function draw() {
    if (strobeON == 1) { // Button Strobe is pressed
        doStrobe(function(){
            setTimeout(draw,30); // repeat
        });    
    }   else if  (particleON == 1) { // Button Particle is toggled ON  
        doParticles(function(){
            setTimeout(draw,particleTimeoutDelay); // repeat
        });
    }   else if  (randomStrobeON == 1) { // Button Random Strobe is toggled ON
        doRandomeStrobe(function(){
            setTimeout(draw,randomStrobeTimeoutDelay); // repeat
        });     
    }   else {
        doFall(function(){
            setTimeout(draw,30); // repeat
        });
    }
}
 
function doRandomeStrobe(callback) { // effect 3 (random color strobe)   
    
    var red = Math.floor((Math.random() * redRandomTo) + 1);
    var green = Math.floor((Math.random() * greenRandomTo) + 1);
    var blue = Math.floor((Math.random() * blueRandomTo) + 1);
    console.log(red, green, blue);   
        for (var pixel = 0; pixel < pixels; pixel++)
    {
        client.setPixel(pixel, red, green, blue);
    }
      client.writePixels();
      callback();
}
 
function doParticles(callback) { // effect 2 (particle) 

    var numParticles = pixels;
    var particles = [];

    var trail = 116.0;
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
 
function doFall(callback) { // (vawes Math.sin(time)) 
    var millis = new Date().getTime();
    for (var pixel = 0; pixel < pixels; pixel++) {
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
    setPixels(red1,green1,blue1); // set params from OSC

    setTimeout(function(){
        setPixels(0,0,0); // black
 
        setTimeout(callback,sdelay/*delay after black*/);
 
    }, 10/*delay*/);
}
 
function setPixels(r,g,b) {
    for (var pixel = 0; pixel < pixels; pixel++) {
        client.setPixel(pixel, r, g, b);
    }
    client.writePixels();
}

 
draw();
