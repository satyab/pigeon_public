/**
 * App
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    pub_id: {
      type: 'string',
      required: true
    },
    app_name: {
      type: 'string',
      required: true
    },
    app_info: 'string'
  }

};
