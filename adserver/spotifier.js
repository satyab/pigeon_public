var url = require('url');
var mongo = require('./mongo');
var http = require('http');
var config = require('./config');
var LRU = require("lru-cache");
var cache = LRU(500);
var geoip = require('geoip-lite');

mongo.init(config.mongo, function(db) {
  updateLocations(db);
});

function updateImpression(id, geo) {
  console.log(geo.county + ":" + geo.city);
  db.collection("impressions")
    .findAndModify(
      {'_id': new ObjectID(id)},
      [['_id','asc']],
      { $set: {county: geo.county, city: geo.city}},
      {},
      function(err, impression) {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
}

function updateLocations(db) {
  db.collection("impressions")
    .find(
      {contry:null, city:null},
      function(err, impressions) {
        for (i in impressions) {
          if ( !impressions[i].ip ) continue;
          var geo = cache.get(impressions[i].ip);
          if (!geo) {
            geo = geoip.lookup(impressions[i].ip);
            cache.set(impressions[i].ip, geo);
          } 
          updateImpression(impressions[i]._id.toString(), geo);
        }
      }
    );
}
