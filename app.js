var arDrone = require('ar-drone');



var client = arDrone.createClient()
client.disableEmergency()

client.on('navdata', function(e){
console.log(e)
  if(e.demo.altitude > 1.5) {
    console.log('TOO HIGH! Safety')
    client.down(0.2)
    client.after(200, function(){
      console.log('went down')
       client.down(0)
     })
  }

  if(e.droneState.flying==1 && e.demo.altitude < 0.2) {
      client.up(0.2)
      client.after(200, function(){
        client.up(0)
      })
    }
})


var express = require('express');
var app = express();



app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);


app.get('/takeoff', function(req, res){
  console.log('taking off')
  res.writeHead(200);
  res.end();
  client.takeoff();
});

app.get('/stop', function(req, res){
  client.stop();
  res.writeHead(200);
    res.end();
});

app.get('/land', function(req, res){
  client.land();
  res.writeHead(200);
    res.end();
});

app.get('/clockwise', function(req, res){
  client.clockwise(0.2);
  res.writeHead(200);
    res.end();
});

app.get('/anticlockwise', function(req, res){
  client.clockwise(-0.2);
  res.writeHead(200);
    res.end();
});

app.get('/forwards', function(req,res) {
  client.front(0.2);
  res.writeHead(200);
  res.end();
});

app.get('/backwards', function(req,res) {
  client.back(0.2);
  res.writeHead(200);
  res.end();
});

app.get('/left', function(req,res) {
  client.left(0.2);
  res.writeHead(200);
  res.end();
});


app.get('/right', function(req,res) {
  client.left(0.2);
  res.writeHead(200);
  res.end();
});

app.get('/up', function(req,res) {
  client.up(0.2);
  res.writeHead(200);
  res.end();
});

app.get('/down', function(req,res) {
  client.down(0.2);
  res.writeHead(200);
  res.end();
});




var pngStream = client.getPngStream();


var lastPng;
pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    lastPng = pngBuffer;
  });

app.get('/picture', function(req,res){
  if (!lastPng) {
      res.writeHead(503);
      res.end('Did not receive any png data yet.');
      return;
    }

    res.writeHead(200, {'Content-Type': 'image/png'});
    res.end(lastPng);
})


