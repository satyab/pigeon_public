/**
 * AdvertiserController
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

var bcrypt = require('bcrypt');

module.exports = {
  
  'new': function(req, res, next) {
    res.view();
  },

  create: function(req, res, next) {
    var advertiserObj = {
      email: req.param('email'),
      password: req.param('password'),
      confirmPassword: req.param('confirm-password')
    }

    // Create a User with the params sent from
    // the sign-up form --> new.ejs
    Advertiser.create(advertiserObj, function advertiserCreated(err, advertiser) {

      // If there's an error
      // if (err) return next(err);

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        };

        // If error redirect back to sign-up page
        return res.redirect('/advertiser/new');
      }

      // Log user in
      req.session.authenticatedAdvertiser = true;
      req.session.Advertiser = advertiser;

      advertiser.save(function(err, advertiser) {
        if (err) return next(err);

        // After successfully creating the user
        // redirect to the show action
        
        res.redirect('/advertiser/show/' + advertiser.id);
      });
    });
  },

  // render the profile view (e.g. /views/show.ejs)
  show: function(req, res, next) {
    Advertiser.findOne(req.param('id'), function foundUser(err, advertiser) {
      if (err) return next(err);
      if (!advertiser) return next();
      res.view({
        advertiser: advertiser
      });
    });
  },

  
  login: function(req, res, next) {

    if (req.session.authenticatedAdvertiser) {
      res.redirect('/advertiser/show/'+req.session.Advertiser.id);      
    }
      
    if ( "GET" == req.method ) {
      return res.view();
    }

    // Check for email and password in params sent via the form, if none
    // redirect the browser back to the sign-in form.
    if (!req.param('email') || !req.param('password')) {

      req.session.flash = {
        err: 'Enter both username and password.'
      }

      res.redirect('/advertiser/login');
      return;
    }

    // Try to find the user by there email address.
    // findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
    Advertiser.findOneByEmail(req.param('email'), function foundUser(err, advertiser) {
      if (err) return next(err);

      // If no user is found...
      if (!advertiser) {
        req.session.flash = {
          err: 'The email address not found.'
        }
        res.redirect('/advertiser/login');
        return;
      }

      // Compare password from the form params to the encrypted password of the advertiser found.
      bcrypt.compare(req.param('password'), advertiser.password, function(err, valid) {
        if (err) return next(err);

        // If the password from the form doesn't match the password from the database...
        if (!valid) {
          req.session.flash = {
            err: 'Invalid email and password combination.'
          }
          res.redirect('/advertiser/login');
          return;
        }

        // Log advertiser in
        req.session.authenticatedAdvertiser = true;
        req.session.Advertiser = advertiser;

        advertiser.save(function(err, advertiser) {
          if (err) return next(err);

          //Redirect to their profile page (e.g. /views/advertiser/show.ejs)
          res.redirect('/advertiser/show/' + advertiser.id);
        });
      });
    });
  },

  logout: function(req, res, next) {

    Advertiser.findOne(req.session.Advertiser.id, function foundAdvertiser(err, advertiser) {

      var advertiserId = req.session.Advertiser.id;

      // Wipe out the session (log out)
      req.session.destroy();
      
      // Redirect the browser to the sign-in screen
      res.redirect('/advertiser/login');
    });
  },
  
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AdvertiserController)
   */
  _config: {}

  
};
