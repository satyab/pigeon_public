module.exports = function(req, res, next) {

  res.locals.flash = {};
  if(!req.session.flash || 0 == Object.keys(req.session.flash).length) return next();
  res.locals.flash = _.clone(req.session.flash);
  console.log(res.locals.flash);  
  req.session.flash = {};
  next();
  
};
