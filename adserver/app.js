var url = require('url');
var mongo = require('./mongo');
var memcached = require('./mem');
var http = require('http');
var config = require('./config');
var adserver = require('./adserver');

var mem = memcached.init(config.memcached);
mongo.init(config.mongo, function(db) {
  adserver.init(db, mem, config.adserver);  
});

function requestListener(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  if ('/ping.html' == url.parse(req.url, true, true).pathname) {
    res.end("Yo.. I m here... :)");
    return;
  }
  adserver.serve(req, res);
  return;
}

http.createServer(requestListener)
  .listen(config.http.port, config.http.host);
console.log("Listening on " + config.http.host+":"+config.http.port);
