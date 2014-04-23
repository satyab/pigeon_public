/**
 * Allow a logged-in user to see, edit and update her own profile
 * Allow admins to see everyone
 */

module.exports = function(req, res, next) {

  var sessionUserMatchesId = (req.session.Advertiser && req.session.Advertiser.id == req.param('id'));

  // The requested id does not match the user's id,
  if (!(sessionUserMatchesId)) {
    req.session.flash = {
      err: "Wrong ID ( No peeping ... :P )"
    }
    res.redirect('/advertiser/login');
    return;
  }

  next();

};
