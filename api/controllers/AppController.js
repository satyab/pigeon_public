/**
 * AppController
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

module.exports = {
    
  'new': function(req, res, next) {
    CategoryType.find()
      .exec(function(err, categories) {
        res.view({categories: categories});
      });
  },

  create: function(req, res, next) {
    var publisher = req.session.Publisher;
    var appObj = {
      app_name: req.param('app_name'),
      app_info: req.param('app_info'),
      pub_id: publisher.id
    };
    var categories = req.param('categories');

    App.create(appObj, function appCreated(err, app) {

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        };

        return res.redirect('/app/new');
      }

      app.save(function(err, app) {
        if (err) {
          console.log(err);
          return next(err);
        }
        for ( i in categories ) {
          
          var appCategoryObj = {
            app_id: app.id,
            category_id: categories[i]
          };

          AppCategory.create(appCategoryObj, function(err, appCategory) {
            
            if (err) {
              console.log(err);
              return next(err);
            }

            appCategory.save(function(err, appCategory) {
              if (err) {
                console.log(err);
                return next(err);
              }
            });
            
          });
        }
        res.redirect('/app/show/' + app.id);
      });
      
    });
  },

  show: function(req, res, next) {
    App.findOne({id: req.param('id'), pub_id: req.session.Publisher.id}, function foundApp(err, app) {
      if (err) return next(err);
      if (!app) return next();
      
      AppCategory.find({
        app_id: app.id
      }, function(err, categories) {

        if (err) return next(err);
        if (!categories) return next(err);
        if (0 == categories.length) {
          res.view({
            app: app,
            categories: categories
          });
        };
        
        var categoryIds = _.map(categories, function(category) {
          return category.category_id;          
        });

        CategoryType.findByIdIn(categoryIds)
          .done( function(err, categories) {
            console.log(categories);
            if (err) return next(err);
            if (!categories) return next(err);
            res.view({
              app: app,
              categories: categories
            });          
        });
        
      });

    });
  },

  list: function(req, res, next) {
    var publisher = req.session.Publisher;
    App.find({
      pub_id: publisher.id
    }, function(err, apps) {
      if (err) return next(err);
      if (!apps) return next();
      res.view({
        apps: apps
      });
    });
  },
  
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AppController)
   */
  _config: {}
  
};
