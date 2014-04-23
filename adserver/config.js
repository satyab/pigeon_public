module.exports = {
  mongo: {
    hosts: [
      "172.31.1.89:27017",
      "172.31.1.58:27017",
      "172.31.1.59:27017"
    ],
    db: 'pigeondb_clean',
    replicaSet: 'pigeon',
    adOpts: {
      'poolSize': 5,
      'readPreference': 'secondaryPreferred'
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
    host: '0.0.0.0',
    port: 80
  },
  adserver: {
    defaultAd: {
      headline: "Pigeon Ad Network",
      text: "New Boy in the City"
    },
    requiredParams: ['appZoneId'],
    timeout: 60
  }
}
