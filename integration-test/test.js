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
      var i, noise = 10;
      var p = server.put('noise0', 'noise0');
      for (i = 1; i < noise; i++) {
        p = p.then(server.put.bind(server, 'noise' + i, 'noise' + i));
      }
      return p.then(client.sync).then(function () {
        return server.put('key', 'value');
      }).then(client.sync).then(client.get).then(function (state) {
        assert.equal('value', state.key);
      });
    });

    it('should handle many added item', function() {
      var i, items = 1000;
      var p = server.put('key0', 'value0');
      for (i = 1; i < items; i++) {
        p = p.then(server.put.bind(server, 'key' + i, 'value' + i));
      }
      return p.then(client.sync).then(client.get).then(function (state) {
        for (i = 0; i < items; i++) {
          assert.equal('value' + i, state['key' + i]);
        }
      });
    });

    it('should handle removed item', function() {
      var i, initial = 10;
      var p = server.put('initial0', 'value0');
      for (i = 1; i < initial; i++) {
        p = p.then(server.put.bind(server, 'initial' + i, 'initial' + i));
      }
      return p.then(client.sync).then(function () {
        return server.del('initial0');
      }).then(client.sync).then(client.get).then(function (state) {
        assert.equal(undefined, state.initial0);
      });
    });

    it('should handle modified item', function() {
      var i, initial = 10;
      var p = server.put('initial0', 'value0');
      for (i = 1; i < initial; i++) {
        p = p.then(server.put.bind(server, 'initial' + i, 'initial' + i));
      }
      return p.then(client.sync).then(function () {
        return server.put('initial0', 'another_value');
      }).then(client.sync).then(client.get).then(function (state) {
        assert.equal('another_value', state.initial0);
      });
    });
  });
})();
