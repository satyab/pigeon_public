/**
 * Advertiser
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  tableName: 'ad_users',
  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    role_id: {
      type: 'integer',
      defaultsTo: 1
    },
    verified: 'string',
    other_info: 'string'
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
