var process = require('process');
var url = require('url');
var mongo = require('./mongo');
var ObjectID = require('mongodb').ObjectID;
var http = require('http');
var config = require('./config');
var LRU = require("lru-cache");
var cache = LRU(500);
var geoip = require('geoip-lite');
var db;

mongo.init(config.mongo, function(database) {
  db = database;
  updateLocations();
});

function updateImpression(id, geo) {
  db.collection("impressions")
    .findAndModify(
      {'_id': new ObjectID(id)},
      [['_id','asc']],
      { $set: {country: geo.country, city: geo.city}},
      {},
      function(err, impression) {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
}

function updateLocations() {
  console.log("Update started");
  db.collection("impressions")
    .find({country:null, city:null})
    .toArray(
      function(err, impressions) {
        if (err || !impressions ) {
          console.log("Error retrieving impressions");
          return;
        }
        for (i in impressions) {
          if ( !impressions[i].ip ) continue;
          var geo = cache.get(impressions[i].ip);
          if (!geo) {
            geo = geoip.lookup(impressions[i].ip);
            cache.set(impressions[i].ip, geo);
          }
          if (geo)
            updateImpression(impressions[i]._id.toString(), geo);
        }
        console.log("Updated complete");
        process.exit();
      }
    );
}
