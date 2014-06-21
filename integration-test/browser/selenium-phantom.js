(function () {
  'use strict';

  var q = require('q');
  var spawn = require('child_process').spawn;
  var phantomjs = require('phantomjs').path;
  var net = require('net');
  var webdriver = require('selenium-webdriver');

  function randomPort() {
    // http://tools.ietf.org/html/rfc6335
    return Math.floor(Math.random() * (65535 - 49152 + 1) + 49152);
  }

  function newPhantom() {
    var port = randomPort();
    var child;

    function start() {
      return q().then(function () {
        var d = q.defer();
        child = spawn(phantomjs, ['--webdriver=' + port, '--web-security=no'], { stdio : 'ignore' });
        child.once('error', d.reject.bind(d));

        function tryConnect() {
          var client = net.connect({ port : port }, d.resolve.bind(d));
          client.once('error', setTimeout.bind(null, tryConnect, 10));
        }
        tryConnect();

        return d.promise;
      });
    }

    function stop() {
      return q().then(function () {
        var d = q.defer();
        child.once('error', d.reject.bind(d));
        child.once('exit', d.resolve.bind(d));
        child.kill();
        return d.promise;
      });
    }

    function newDriver() {
      return new webdriver.Builder().usingServer('http://localhost:' + port).build();
    }

    return {
      start : start,
      stop : stop,
      newDriver : newDriver
    };
  }

  module.exports = {
    newServer : newPhantom,
    webdriver : webdriver
  };
})();
