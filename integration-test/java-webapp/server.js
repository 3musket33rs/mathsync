(function () {
  'use strict';

  var spawn = require('child_process').spawn;
  var net = require('net');
  var q = require('q');
  var loop = 12004;

  module.exports = function start(listenport) {
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

    function read() {
      var d = q.defer();
      connection.once('line', function (line) {
        var data = {};
        var elements = line.split(',');
        elements.forEach(function (element) {
          if(element.length > 0) {
            var a = element.split(':');
            data[a[0]] = a[1];
          }
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
        var lines = buff.split(/\r?\n/);
        for (var i = 0; i < lines.length - 1; i++) {
          connection.emit('line', lines[i]);
        }
        buff = lines[lines.length - 1];
      });

      deferred.resolve({
        clear: clear,
        put: put,
        stop: stop
      });
    });

    var env = {};
    for (var prop in process.env) {
      env[prop] = process.env[prop];
    }
    env.LOOP = loop;

    server.listen(loop, function() {
      child = spawn('mvn', ['clean', 'package', 'jetty:run', '-Djetty.port=' + listenport], {
        cwd: __dirname,
        stdio: 'inherit',
        env: env
      });
    });

    return deferred.promise;
  };
})();
