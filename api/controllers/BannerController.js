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
  
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BannerController)
   */
  _config: {}

  
};
