(function () {
  'use strict';

  var assert = require('assert');
  var startClient = require('./' + process.env.CLIENT + '/client');
  var startServer = require('./' + process.env.SERVER + '/server');

  var client;
  var server;

  before(function () {
    var port = 12003;
    return startServer(port).then(function (s) {
      server = s;
      return startClient(port);
    }).then(function (c) {
      client = c;
    });
  });

  beforeEach(function () {
    return server.clear().then(client.clear);
  });

  after(function () {
    return client.stop().then(server.stop);
  });

  describe('Synchronization', function() {

    it('should handle added item', function() {
      return server.put('key', 'value').then(client.sync).then(client.get).then(function (state) {
        assert.equal('value', state.key);
      });
    });

    it('should handle many added item', function() {
      var i;
      var items = 1000;
      var p = server.put('key0', 'value0');
      for (i = 1; i < items; i++) {
        (function (j) {
          p = p.then(function () {
            return server.put('key' + j, 'value' + j);
          });
        })(i);
      }
      return p.then(client.sync).then(client.get).then(function (state) {
        for (i = 0; i < items; i++) {
          assert.equal('value' + i, state['key' + i]);
        }
      });
    });

    it('should handle removed item', function() {
      return server.put('key', 'value').then(client.sync).then(function () {
        return server.del('key');
      }).then(client.sync).then(client.get).then(function (state) {
        assert.equal(undefined, state.key);
      });
    });

    it('should handle modified item', function() {
      return server.put('key', 'value1').then(client.sync).then(function () {
        return server.put('key', 'value2');
      }).then(client.sync).then(client.get).then(function (state) {
        assert.equal('value2', state.key);
      });
    });
  });
})();
