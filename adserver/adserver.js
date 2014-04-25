var url = require('url');
var ua = require('express-useragent');
var ObjectID = require('mongodb').ObjectID;
var config;
var db, mem;

function validateRequest(req) {
  if ( "GET" !== req.method ) {
    return null;
  }
  var params = url.parse(req.url, true).query;
  for ( i in config.requiredParams ) {
    if ( !params[config.requiredParams[i]] ) throw "Parameter Not Found : "+config.requiredParams[i];
  }
  return params;
}

function formatAd(params) {
  return '<h3 style="margin:0; padding:0"><a href="'+params.destUrl+'">'+params.headline+'</a></h3>'+'<div style="color:green;">'+params.destUrl+'</div><div>'+params.text+'</div>';
}

function serveDefaultAd(res) {
  res.end(formatAd(config.defaultAd));
  return;
}

function passAppZone(req, res, data, appzone) {
  data.pubId = appzone.pubId;
  data.appId = appzone.appId;
  data.zoneId = appzone.zoneId;
  data.appZoneId = appzone._id;
  getBanners(req, res, data, appzone);
}

function getAppZone(req, res, data, appZoneId) {
  var key = 'appzone'+appZoneId;
  mem.get(key, function(err, appzone) {
    if ( err || !appzone ) {
      db.collection("appzone")
        .findOne(
          new ObjectID(appZoneId),
          function(err, appzone) {
            if (err || !appzone) {
              serveDefaultAd(res);
              console.log(err);
              return;
            }
            mem.set(key, appzone, config.timeout, function(err) {});
            passAppZone(req, res, data, appzone);
          }
        );
    } else {
      passAppZone(req, res, data, appzone);
    }
  });
}

function passBanners(req, res, data, banners) {
    selectBanner(req, res, data, banners);
}

function getBanners(req, res, data, appzone) {
    var key = "";
    for ( i in appzone.categories ) {
        key += appzone.categories[i];
    }
    mem.get(key, function(err, banners) {
        if ( err || !banners ) {
            db.collection("masala")
                .find({
                    categoryId: {
                        $in: appzone.categories
                    }
                }, function(err, banners) {
                    if ( err || !banners ) {
                        serveDefaultAd(res);
                        console.log(err);
                        return;
                    }
                    banners.toArray(function(err, banners) {
                        if ( 0 == banners.length ) {
                            serveDefaultAd(res);
                            return;
                        }
                        passBanners(req, res, data, banners);
                        mem.set(key, banners);
                    });
                });

        } else {
            passBanners(req, res, data, banners);
        }
    });
}

function selectBanner(req, res, data, banners) {
  var random = Math.floor((Math.random()*100)+1) % banners.length; 
  var banner = banners[random];
  data.campaignId = banner.campaignId;
  data.bannerId = banner._id;
  data.advertiserId = banner.advertiserId;
  return deliverAndUpdate(req, res, data, banner);
}

function masalaCleanUp(campaign) {
  if ( 0 >= campaign.remainingLimit ) {
    db.collection("masala")
      .remove({
        campaignId: campaign._id.toString()
      }, function() {});
  }
  return;
}

function updateImpressions(req, data) {
  var userInfo = ua.parse(req.headers['user-agent']);
  data.os = userInfo.OS;
  data.mobile = userInfo.isMobile;
  data.browser = userInfo.Browser;
  data.ua = userInfo.source;
  data.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  data.country = null;
  data.city = null;
  data.timestamp = (new Date).getTime();
  db.collection("impressions")
    .insert(data, function() {});
  db.collection("campaign")
    .findAndModify(
      {'_id': new ObjectID(data.campaignId)},
      [['_id','asc']],
      { $inc: {remainingLimit: -1}},
      {'new': true},
      function(err, campaign) {
        if (err) {
          console.log(err);
          return;
        }
        masalaCleanUp(campaign);        
      }
    );
}

function deliverAndUpdate(req, res, data, banner) {
  res.end(formatAd(banner));
  updateImpressions(req, data);
  return;
}

function serveAd(req, res, params) {
  getAppZone(req, res, {}, params.appZoneId );
  return;
}

module.exports = {

  init: function(database, memcached, opts) {
    db = database;
    mem = memcached;
    config = opts;
    return;
  },

  serve: function(req, res) {
    try {
      var params = validateRequest(req);
      serveAd(req, res, params);
    } catch (e) {
      serveDefaultAd(res);
    }
    return;
  }
  
}
