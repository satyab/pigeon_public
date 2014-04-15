/**
 * BannerController
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
module.exports = {
  
  'new': function(req, res, next) {
    async.parallel({
      campaigns: function(cb) {
        Campaign.find({
          advId: req.session.Advertiser.id
        })
          .done(function(err, campaigns) {
            if(err) return next(err);
            cb(null, campaigns);
          })
      },
      types: function(cb) {
        ContentType.find()
          .done(function(err, types) {
            if(err) return next(err);
            cb(null, types);
          })
      },
      zones: function(cb) {
        ZoneType.find()
          .done(function(err, zones) {
            if(err) return next(err);
            cb(null, zones);
          })
      }
    }, function(err, result) {
      if (err) return next(err);
      res.view(result);
    });
  },

  create: function(req, res, next) {
    var advertiser = req.session.Advertiser;
    var banner = req.params.all();
    banner.advertiserId = advertiser.id;
    Banner.create(
      banner,
      function bannerCreated(err, banner) {
        if ( err ) return next(err);
        banner.save(function(err, banner) {
          if ( err ) return next(err);          
          CampaignCategory.findByCampaignId(
            banner.campaignId,
            function(err, categories) {
              if ( err ) return next(err);
              var masala = _.pick(banner, 'headline', 'text', 'destUrl', 'zoneId', 'campaignId', 'advertiserId');
              masala.bannerId = banner.id;
              for(i in categories) {
                masala.categoryId = categories[i].categoryId;
                Masala.create(masala, function(err, masala) {
                  if ( err ) return next(err);
                  masala.save(function(err, masala) {
                    if (err) return next(err);
                  });
                });
              }
            }
          );
          return res.redirect('/banner/list');
        });
      }
    );
  },

  list: function(req, res, next) {
    var advertiser = req.session.Advertiser;
    Banner.findByAdvertiserId(advertiser.id, function(err, banners) {
      if (err) return next(err);
      res.send(banners);
    });    
  },
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BannerController)
   */
  _config: {}

  
};
