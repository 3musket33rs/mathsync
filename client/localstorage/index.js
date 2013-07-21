var syncBuilder = require('sync-client');

module.exports = (function() {
  'use strict';

  function setup(storage, config) {
    config = config || {};
    var filter = config.filter || function () { return true; };
    var stringify = config.stringify || function (key, value) { return JSON.stringify({ k: key, v: value }); };
    var parse = config.parse || function (serialized) { return JSON.parse(serialized); };
    var sync = syncBuilder(createSyncConfig(config));

    readInitial(storage, sync, stringify);

    var listener = function (e) {
      if (e.storageArea === storage) {
        var tx = sync.start();
        if (e.key === null) {
          tx.clear();
        } else if (filter(e.key)) {
          if (e.oldValue !== null) {
            tx.remove(stringify(e.key, e.oldValue));
          }
          if (e.newValue !== null) {
            tx.add(stringify(e.key, e.newValue));
          }
        }
        tx.commit();
      }
    };

    window.addEventListener('storage', listener, false);

    return function stop() {
      window.removeEventListener(listener);
    };
  }

  function createSyncConfig(localStorageConfig) {
    var config = {};

    return config;
  }

  function readInitial(storage, sync, stringify) {
    var tx = sync.start();
    var key;
    for (var i = 0; i < storage.length; i++) {
      key = storage.key(i);
      tx.add(stringify(key, storage.getItem(i)));
    }
    tx.commit();
  }

  return setup;
})();
