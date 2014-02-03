(function () {
  'use strict';

  var spawn = require('child_process').spawn;
  var net = require('net');
  var q = require('q');

  module.exports = function start(serverport, listenport, loop) {
    var deferred = q.defer();
    var child;
    var connection;
    var server;

    function stop() {
      var d = q.defer();
      child.once('error', d.reject);
      child.once('close', d.resolve);
      child.kill('SIGKILL');
      return d.promise;
    }

    function clear() {
      connection.write('CLEAR\r\n');
      return read();
    }

    function put(key, value) {
      connection.write('PUT ' + key + ' ' + value + '\r\n');
      return read();
    }

    function del(key, value) {
      connection.write('DELETE ' + key + '\r\n');
      return read();
    }

    function get() {
      connection.write('GET\r\n');
      return read();
    }

    function sync() {
      connection.write('SYNC\r\n');
      return read();
    }

    function read() {
      var d = q.defer();
      connection.once('line', function (line) {
        var data = {};
        var elements = line.split(',');
        elements.forEach(function (element) {
          var a = element.split(':');
          data[a[0]] = a[1];
        })
        d.resolve(data);
      });
      return d.promise;
    }

    server = net.createServer(function(c) {
      connection = c;
      connection.setEncoding('utf-8');

      var buff = '';
      connection.on('data', function(data) {
        buff += data;
        var lines = buff.split('\r\n');
        for (var i = 0; i < lines.length - 1; i++) {
          connection.emit('line', lines[i]);
        }
        buff = lines[lines.length - 1];
      });

      deferred.resolve({
        clear: clear,
        get: get,
        put: put,
        del: del,
        sync: sync,
        stop: stop
      });
    });
    var env = {
      LOOP: loop,
      PATH: process.env.PATH
    };
    if (listenport) {
      env.LISTEN = listenport;
    }
    if (serverport) {
      env.UPSTREAM = serverport;
    }
    server.listen(loop, function() {
      child = spawn('node', ['--harmony', 'index.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        env: env
      });
    });

    return deferred.promise;
  };
})();
