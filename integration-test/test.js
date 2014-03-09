(function () {
  'use strict';

  var assert = require('assert');
  var startClient = require('./' + process.env.CLIENT + '/client');
  var startServer = require('./' + process.env.SERVER + '/server');

  var client;
  var server;

  before(function (done) {
    var port = 12003;
    startServer(port).then(function (s) {
      server = s;
      return startClient(port);
    }).then(function (c) {
      client = c;
    }).then(done, done);
  });

  beforeEach(function (done) {
    server.clear().then(client.clear).then(function () {}).then(done, done);
  });

  after(function (done) {
    client.stop().then(server.stop).then(done, done);
  });

  describe('Synchronization', function() {

    it('should handle added item', function(done) {
      server.put('key', 'value').then(client.sync).then(client.get).then(function (state) {
        assert.equal('value', state.key);
      }).then(done, done);
    });

    it('should handle many added item', function(done) {
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
      p.then(client.sync).then(client.get).then(function (state) {
        for (i = 0; i < items; i++) {
          assert.equal('value' + i, state['key' + i]);
        }
      }).then(done, done);
    });

    it('should handle removed item', function(done) {
      server.put('key', 'value').then(client.sync).then(function () {
        return server.del('key');
      }).then(client.sync).then(client.get).then(function (state) {
        assert.equal(undefined, state.key);
      }).then(done, done);
    });

    it('should handle modified item', function(done) {
      server.put('key', 'value1').then(client.sync).then(function () {
        return server.put('key', 'value2');
      }).then(client.sync).then(client.get).then(function (state) {
        assert.equal('value2', state.key);
      }).then(done, done);
    });
  });
})();
