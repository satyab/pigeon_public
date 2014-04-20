var Client = require("mongodb").MongoClient;
var db;

function getConnectURL (opts) {
  var url = "mongodb://";
  var i = 0;
  url += opts.hosts[i];
  i++;
  while( i < opts.hosts.length) {
    url += "," + opts.hosts[i];
    i++;
  }
  url+= "/"+opts.db;
  url+="?";
  for(i in opts.adOpts) {
    url+= i + "=" + opts.adOpts[i] + "&";
  }
  console.log("Mongo Url : " + url);
  return url;
}

module.exports = {
  init: function(opts, onInit) {
    Client.connect(getConnectURL(opts), function(err, database) {
      if(err) {
        console.log(err);
        return null;
      }
      console.log("Connected to mongo");
      db = database;
      onInit(db);
    });
    return db;
  }
}
