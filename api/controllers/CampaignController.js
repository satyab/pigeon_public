/**
 * CampaignController
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
      revenueTypes: function(cb) {
        RevenueType.find()
        .exec(function(err, revenueTypes) {
          if (err) return next(err);
          cb(null, revenueTypes);
        });
      },
      categories: function(cb) {
        CategoryType.find()
          .exec(function(err, categories) {
            if (err) return next(err);
            cb(null, categories);            
          });
      }
    }, function(err, result) {
      if (err) return next(err);
      return res.view(result);
    });
  },

  create: function(req, res, next) {
    campaignObj = {
      name: req.param('name'),
      revenueTypeId: req.param('revenueTypeId'),
      freuencyCap: req.param('freuencyCap'),
      priority: req.param('priority'),
      startDate: req.param('startDate'),
      endDate: req.param('endDate'),
      limit: req.param('limit'),
      categories: req.param('categories'),
      advId: req.session.Advertiser.id
    };

    Campaign.create(campaignObj, function(err, campaign) {
      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        };

        return res.redirect('/campaign/new');
      }      
      campaign.save(function(err, campaign) {
        if (err) {
          console.log(err);
          return next(err);
        }
        res.redirect('/campaign/show/' + campaign.id);
      });
    });
  },

  show: function(req, res, next) {
    Campaign.findOne({
      id: req.param('id'),
      advId: req.session.Advertiser.id
    }).done(function(err, campaign) {
      if (err) return next(err);
      if (!campaign) return next();
      res.send(campaign);
    });
  },
  
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CampaignController)
   */
  _config: {}

  
};
