var url = require('url');
var ua = require('express-useragent');
var config;
var db, mem;

function validateRequest(req) {
  if ( "GET" !== req.method ) {
    console.log("Wrong request method: "+req.method);    
    return null;
  }
  var params = url.parse(req.url, true).query;
  for ( i in config.requiredParams ) {
    if ( !params[config.requiredParams[i]] ) return null;
  }
  return params;
}

function formatAd(params) {
  return "<h1>"+params.headline+"</h1>"+"<h3>"+params.text+"</h3>";
}

function serveDefaultAd(res) {
  res.end(formatAd(config.defaultAd));
  return;
}

function getAppZone(req, res, data, appZoneId) {
  db.collection("appzone")
    .findOne(
      appZoneId,
      function(err, appzone) {
        if (err) {
          console.log(err);
          return;
        }
        data.pubId = appzone.pubId;
        data.appId = appzone.appId;
        data.zoneId = appzone.zoneId;
        data.appZoneId = appzone._id;
        getBanners(req, res, data, appzone);
      }
    );
  return;
}

function getBanners(req, res, data, appzone) {
  db.collection("masala")
    .find({
      categoryId: {
        $in: appzone.categories
      }
    }, function(err, banners) {
      if ( err ) {
        console.log(err);
        return;
      }
      selectBanner(req, res, data, banners);
    });
}

function selectBanner(req, res, data, banners) {
  var banner = banners[0];
  data.campaignId = banner.campaignId;
  data.bannerId = banner._id;
  data.advertiserId = banner.advertiser.id;
  return deliverAndUpdate(req, res, data, banner);
}

function masalaCleanUp(campaign) {
  if ( 0 >= campaign.remainingLimit ) {
    db.collection("masala")
      .delete({
        campaignId: campaign._id
      });
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
  db.collection("impressions")
    .insert(data);
  db.collection("campaign")
    .findAndModify(
      {'_id': data.campaignId},
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

function serveAd(req, params, res) {
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
    var params = validateRequest(req);
    if ( params ) serveAd(params, res);
    else serveDefaultAd(res);
    return;
  }
  
}
