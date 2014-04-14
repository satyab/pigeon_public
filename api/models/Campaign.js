/**
 * Campaign
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    name: 'string',
    advId: 'string',
    revenueTypeId: 'string',
    freuencyCap: 'integer',
    priority: 'integer',
    startDate: 'date',
    endDate: 'date',
    limit: 'integer',
    remainingLimit: 'integer'
  }
};
