module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticatedPublisher) {
    return res.redirect('/publisher');    
  } else if (req.session.authenticatedAdvertiser) {
    return res.redirect('/advertiser');    
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return next();
  //return res.forbidden('You are not permitted to perform this action.');
};
