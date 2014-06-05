#!/usr/bin/env node
 
 
var osc = require('node-osc');
var oscServer = new osc.Server(8000, '0.0.0.0');
var OPC = new require('./opc');
// var model = OPC.loadModel(process.argv[2] || '/home/pi/fadecandy/examples/layouts/strip230n.json');
var client = new OPC('localhost', 7890);
 
 
var red1 = 255;
var green1 = 255;
var blue1 = 255;
var fall = 0;
var strobeON = 0;
var sdelay = 0;
 
 
oscServer.on('message', function (msg, rinfo) {
 
    // Show the message, for debugging
    console.log(msg);
 
 
 
if (msg[0] == '/1/RED') red1 = msg[1];
if (msg[0] == '/1/GREEN') green1 = msg[1];
if (msg[0] == '/1/BLUE') blue1 = msg[1];
if (msg[0] == '/1/FALLOFF') fall = msg[1];
if (msg[0] == '/1/STROB') strobeON = msg[1];
if (msg[0] == '/1/SDELAY') sdelay = msg[1];
});
 
 
function draw() {
    if (strobeON == 1) { // Button Strobe is pressed
        console.log('do strobe');
        doStrobe(function(){
            setTimeout(draw,30); // repeat
        });
    } else {
        doFall(function(){
            setTimeout(draw,30); // repeat
        });
    }
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
