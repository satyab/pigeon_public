var mongodb = require('mongodb');
var http = require('http');

var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var db;

var serverOptions = {
  'auto_reconnect': true,
  'poolSize': 5
};

var clientOptions = {};

var mongoClient = new MongoClient(
  new Server('localhost', 27017, serverOptions),
  clientOptions
);

mongoClient.open(function(err, mongoClient) {
  db = mongoClient.db("pigeondb_clean");
});

http.createServer(function (req, res) {
  //  res.writeHead(200, {'Content-Type': 'text/plain'});
  db.collection("app").find();
  db.collection("appcategory").find();
  db.collection("campaigncategory").find();    
  db.collection("campaign").find();
  db.collection("appzone").find();    
  db.collection("banner")
    .find()
    .toArray(
      function(err, pubs) {
        res.end(JSON.stringify(pubs));
      }
    );
}).listen(1337, '0.0.0.0');
console.log("Listening on port 1337");
