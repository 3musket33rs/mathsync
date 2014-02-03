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

    it('should handle removed item', function(done) {
      client.put('key', 'value').then(client.sync).then(client.get).then(function (state) {
        assert.equal(undefined, state.key);
      }).then(done, done);
    });
  });
})();
