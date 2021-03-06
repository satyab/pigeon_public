/**
 * AppZoneController
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
      zones: function(cb) {
        ZoneType.find()
          .exec(function(err, zones) {
            if (err) return next(err);            
            cb(null, zones);
          });      
      },
      apps: function(cb) {
        App.find({
          pub_id: req.session.Publisher.id
        },function(err, apps) {
          if (err) return next(err);
          cb(null, apps);
        });        
      }
    }, function(err, result) {
      if (err) return next(err);
      res.view(result);         
    }); 
  },

  create: function(req, res, next) {
    var publisher = req.session.Publisher;
    var appZoneObj = {
      appId: req.param('appId'),
      zoneId: req.param('zoneId'),
      name: req.param('name'),
      info: req.param('info'),
      pubId: publisher.id
    };

    ZoneType.findOne(appZoneObj.zoneId)
      .done(function(err,zoneType) {
  	appZoneObj.height = zoneType.height;
  	appZoneObj.width = zoneType.width;
        AppCategory.findByApp_id(appZoneObj.appId, function(err, appCategories) {
          var categories = _.map(appCategories, function(appCategory) {return appCategory.category_id});
          appZoneObj.categories = categories;
          AppZone.create(appZoneObj, function appZoneCreated(err, appZone) {
            if (err) {
              console.log(err);
              req.session.flash = {
                err: err
              };
              return res.redirect('/appzone/new');
            }
            appZone.save(function(err, appZone) {
              if (err) {
                console.log(err);
                return next(err);
              }
              res.redirect('/appzone/list/');
            });
          });
        });
      });
  },

  show: function(req, res, next) {
    AppZone.findOne(req.param('id'), function foundAppZone(err, appZone) {
      if (err) return next(err);
      if (!appZone) return next();
      res.send(appZone);
    });
  },

  list: function(req, res, next) {
    var publisher = req.session.Publisher;
    App.find({
      pub_id: publisher.id
    }, function(err, apps) {
      if (err) return next(err);
      AppZone.find({
        where: {
          or: _.map(apps,
                    function(app) {
                      return { appId : app.id };
                    })
        }
      }, function(err, appZones) {
        if (err) return next(err);
        return res.view({
          baseUrl: sails.config.baseUrl,
          appZones: appZones
        });
      });
    });

  },
  
  code : function(req, res, next) {
    var publisher = req.session.Publisher;
    return res.send("TBD");
  },
  
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AppZoneController)
   */
  _config: {}

  
};
