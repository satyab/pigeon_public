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
  adserver.serve(req, res);
  return;
}

http.createServer(requestListener)
  .listen(config.http.port, config.http.host);
console.log("Listening on " + config.http.host+":"+config.http.port);
