var arDrone = require('ar-drone');
var http    = require('http');

console.log('Connecting png stream ...');


var client = arDrone.createClient()
client.disableEmergency()


var pngStream = client.getPngStream();

client.takeoff(function(){
  client.stop()
});

client
  .after(5000, function() {
client
  })
  .after(3000, function() {
    this.stop();
    this.land();
  });


var lastPng;
pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    lastPng = pngBuffer;
  });

var server = http.createServer(function(req, res) {
  if (!lastPng) {
    res.writeHead(503);
    res.end('Did not receive any png data yet.');
    return;
  }

  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(lastPng);
});

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
});
