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
      remainingLimit: req.param('limit'),      
      advId: req.session.Advertiser.id
    };

    var categories = req.param('categories');

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
        for ( i in categories ) {

          var campaignCategoryObj = {
            campaignId: campaign.id,
            categoryId: categories[i]
          };

          CampaignCategory.create(campaignCategoryObj, function(err, campaignCategory) {
            
            if (err) {
              console.log(err);
              return next(err);
            }

            campaignCategory.save(function(err, campaignCategory) {
              if (err) {
                console.log(err);
                return next(err);
              }
            });
            
          });
        }
        res.redirect('/campaign/show/' + campaign.id);
      });
    });
  },

  show: function(req, res, next) {
    Campaign.findOne({id: req.param('id'), advId: req.session.Advertiser.id}, function foundCampaign(err, campaign) {
      if (err) return next(err);
      if (!campaign) return next();
      
      CampaignCategory.find({
        campaignId: campaign.id
      }, function(err, categories) {

        if (err) return next(err);
        if (!categories) return next(err);
        if (0 == categories.length) {
          return res.view({
            campaign: campaign,
            categories: categories
          });
        };
        
        var categoryIds = _.map(categories, function(category) {
          return category.categoryId;          
        });
        CategoryType.findByIdIn(categoryIds)
          .done( function(err, categories) {
            if (err) return next(err);
            if (!categories) return next(err);
            res.view({
              campaign: campaign,
              categories: categories
            });          
        });
        
      });

    });
  },

  list: function(req, res, next) {
    var advertiser = req.session.Advertiser;
    Campaign.find({
      advId: advertiser.id
    }, function(err, campaigns) {
      if (err) return next(err);
      if (!campaigns) return next();
      res.view({
        campaigns: campaigns
      });
    });
  },
  
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CampaignController)
   */
  _config: {}

  
};
