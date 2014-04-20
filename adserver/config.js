module.exports = {
  mongo: {
    hosts: [
      "54.187.79.118:27017"
    ],
    db: 'pigeondb_clean',
    replicaSet: 'pigeon',
    adOpts: {
    'poolSize': 5
    },
  },
  memcached: {
    host: [
      "memcached-cluster.dl2abx.0001.usw2.cache.amazonaws.com:11211",
      "memcached-cluster.dl2abx.0002.usw2.cache.amazonaws.com:11211",
      "memcached-cluster.dl2abx.0003.usw2.cache.amazonaws.com:11211"
    ],
    initOpts: {
      
    },
    runOpts: {
      lifetime: 5
    }
  },
  http: {
    host: 'localhost',
    port: 1337
  },
  adserver: {
    defaultAd: {
      headline: "Pigeon Ad Network",
      text: "New Boy in the City"
    },
    requiredParams: ['appZoneId']
  }
}
