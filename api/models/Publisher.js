/**
 * Publisher
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    username: 'string',
    fullname: 'string',
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    address: 'string',
    password: {
      type: 'string',
      required: true
    }
  },

  beforeCreate: function (values, next) {

    if ( !values.password || values.password != values.confirmPassword ) {
      return next("Password doesn't match password confirmation.");
    }

    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) return next(err);
      values.password = encryptedPassword;
      next();
    });
  }
  
};
