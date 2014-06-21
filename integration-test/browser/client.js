(function () {
  'use strict';

  var sp = require('./selenium-phantom');
  var url = require('url');

  module.exports = function startClient(serverport) {
    var server = sp.newServer();
    var driver;

    function clear() {
      return driver.executeScript('window.api.clear()');
    }

    function put(key, value) {
      throw new Error('put not implemented');
    }

    function del(key) {
      throw new Error('del not implemented');
    }

    function get() {
      return driver.executeScript('return window.api.get()');
    }

    function sync() {
      function waitForSyncEnd() {
        return driver.getTitle().then(function (title) {
          if (title === 'sync ongoing') {
            return waitForSyncEnd();
          } else if (title === 'sync done') {
            return;
          } else {
            throw new Error(title);
          }
        });
      }
      return driver.executeScript('window.api.sync(' + serverport + ')').then(waitForSyncEnd);
    }

    function stop() {
      return server.stop();
    }

    return server.start().then(function () {
      driver = server.newDriver();
      driver.get('file:///' + __dirname + '/index.html');
      // TODO delete
      return driver.getTitle().then(function (title) {
        console.log('title is ' + title);
      });
    }).then(function () {
      return {
        clear: clear,
        get: get,
        put: put,
        del: del,
        sync: sync,
        stop: stop
      };
    });
  };
})();
