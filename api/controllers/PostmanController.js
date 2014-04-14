/**
 * PostmanController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var async = require('async');

function getAppAndAppZone(appId, zoneId, onDone) {
  async.parallel({
    app: function(cb) {
      App.findOne(appId)
      .done(function(err, app) {
        if ( !app ) return cb("No app found for ID: " + appId);
        return cb(err, app);
      });
    },
    appzone: function(cb) {
      AppZone.findOne(zoneId)
      .done(function(err, appzone) {
        if ( !appzone ) return cb("No appzone found for ID: " + zoneId);
        return cb(err, appzone);
      });
    }
  }, function(err, result) {
    onDone(err, result.app);
  });
}

function getCategoryIds(app, cb) {
  AppCategory.find({
    app_id: app.id
  }).done(function(err, categories) {
    if ( 0 == categories.length )
      return cb("No categories found for  app ID: "+app.id);
    //var categoryIds = _.map(categories, function(category) {return category.category_id;});
    var categoryIds = [];
    for (i in categories) {
      categoryIds.push(categories[i].category_id);
    }
    return cb(err, categoryIds);
  });
}

function getCampaigns(categoryIds, cb) {
  CampaignCategory.findByCategoryIdIn(categoryIds)
  .done(function(err, campaigns) {
    if ( 0 == campaigns.length )
      return cb("No campaigns found for categoryIds : "+categoryIds);    
    return cb(err, _.map(campaigns, function(campaign) {return campaign.campaignId}));
  });
}

function selectCampaign(campaignIds, cb) {
  var selectedCampaign = campaignIds[0];
  Campaign.findOne(selectedCampaign)
  .done(function(err, campaign) {
    if ( !campaign )
      return cb("No campaign found for campaignID : "+selectedCampaign);
    return cb(err, campaign);
  });
}

function getBanner(campaign, cb) {
  Banner.findOne({
    campaignId: campaign.id
  }, function(err, banner) {
    if ( !banner )
      return cb("No banner found for campaignID : "+campaign); 
    cb(err, banner);
  });
}

function updateClicks(banner, cb) {
  cb(null, banner);
}

function serveLetter(err, banner, res) {
  if (err) {
    console.log(err);
    console.log("Hence serving default ad");
    return res.view("postman/default", {layout:false});
  }
  return res.view("postman/getletter", {
    layout: false,
    banner: banner
  });
}

module.exports = {
    
  getletter: function(req, res, next) {
    var appId = "5346aed8a7a23415336a15f7";
    var zoneId = "5346af06a7a23415336a1601";
    async.waterfall(
      [
        function(cb) {
          getAppAndAppZone(appId, zoneId, cb) 
        },
        getCategoryIds,
        getCampaigns,
        selectCampaign,
        getBanner,
        updateClicks
      ], function(err, banner) {
        serveLetter(err, banner, res);
      }
    );
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PostmanController)
   */
  _config: {}

};
