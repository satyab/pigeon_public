/**
 * PublisherController
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

  index: function(req, res, next) {
    return res.redirect('/publisher/show/'+req.session.Publisher.id);    
  },

  'new': function(req, res, next) {
    res.view();
  },

  create: function(req, res, next) {
    var publisherObj = {
      email: req.param('email'),
      password: req.param('password'),
      confirmPassword: req.param('confirm-password')
    }

    // Create a User with the params sent from
    // the sign-up form --> new.ejs
    Publisher.create(publisherObj, function publisherCreated(err, publisher) {

      // If there's an error
      // if (err) return next(err);

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        };

        // If error redirect back to sign-up page
        return res.redirect('/publisher/new');
      }

      // Log user in
      req.session.authenticatedPublisher = true;
      req.session.Publisher = publisher;

      publisher.save(function(err, publisher) {
        if (err) return next(err);

        // After successfully creating the user
        // redirect to the show action
        
        res.redirect('/publisher/show/' + publisher.id);
      });
    });
  },

  // render the profile view (e.g. /views/show.ejs)
  show: function(req, res, next) {
    Publisher.findOne(req.param('id'), function foundUser(err, publisher) {
      if (err) return next(err);
      if (!publisher) return next();
      res.view({
        publisher: publisher
      });
    });
  },

  login: function(req, res, next) {

    
    if ( "GET" == req.method ) {
      return res.view();
    }

    // Check for email and password in params sent via the form, if none
    // redirect the browser back to the sign-in form.
    if (!req.param('email') || !req.param('password')) {

      req.session.flash = {
        err: 'Enter both username and password.'
      }

      res.redirect('/publisher/login');
      return;
    }

    // Try to find the user by there email address.
    // findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
    Publisher.findOneByEmail(req.param('email'), function foundUser(err, publisher) {
      if (err) return next(err);

      // If no user is found...
      if (!publisher) {
        req.session.flash = {
          err: 'The email address not found.'
        }
        res.redirect('/publisher/login');
        return;
      }

      // Compare password from the form params to the encrypted password of the publisher found.
      bcrypt.compare(req.param('password'), publisher.password, function(err, valid) {
        if (err) return next(err);

        // If the password from the form doesn't match the password from the database...
        if (!valid) {
          req.session.flash = {
            err: 'Invalid email and password combination.'
          }
          res.redirect('/publisher/login');
          return;
        }

        // Log publisher in
        req.session.authenticatedPublisher = true;
        req.session.Publisher = publisher;

        publisher.save(function(err, publisher) {
          if (err) return next(err);

          //Redirect to their profile page (e.g. /views/publisher/show.ejs)
          res.redirect('/publisher/show/' + publisher.id);
        });
      });
    });
  },

  logout: function(req, res, next) {

    Publisher.findOne(req.session.Publisher.id, function foundPublisher(err, publisher) {

      var publisherId = req.session.Publisher.id;

      // Wipe out the session (log out)
      req.session.destroy();
      
      // Redirect the browser to the sign-in screen
      res.redirect('/publisher/login');
    });
  },
  
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PublisherController)
   */
  _config: {}

  
};
