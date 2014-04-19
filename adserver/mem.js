var Memcached = require("memcached");
module.exports = {
  init: function(opts) {
    return new Memcached(opts.host, opts.initOpts);
  }
}
