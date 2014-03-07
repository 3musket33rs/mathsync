var q = require('q');
var net = require('net');
var ms = require('mathsync');

/* Local data */
var data = {};

var serialize = ms.serialize.fromString();
var deserialize = ms.serialize.toString();

function* localItems() {
  for (var k in data) {
    yield (k + ':' + data[k]);
  }
}
var local = ms.summarizer.fromGenerator(localItems, serialize);

var resolve;

var start = q().then(function () {

  /* Upstream data view and synchronization */

  if (process.env.UPSTREAM) {
    var http = require('http');

    var baseUrl = 'http://localhost:' + process.env.UPSTREAM + '/summary/';
    function fetchSummary(level) {
      var deferred = q.defer();

      http.get(baseUrl + level, function (res) {
        var chunks = [];
        res.on('data', function(chunk) {
          chunks.push(chunk);
        });
        res.on('end', function() {
          deferred.resolve(chunks);
        });
      }).on('error', deferred.reject);

      return deferred.promise.then(Buffer.concat).then(JSON.parse);
    }
    var remote = ms.summarizer.fromJSON(fetchSummary);

    resolve = ms.resolver.fromGenerator(localItems, remote, serialize, deserialize);
  }
}).then(function (api) {

  /* HTTP server */

  if (process.env.LISTEN) {
    var app = require('koa')();
    var route = require('koa-route');

    app.use(function *(next){
      var start = new Date();
      yield next;
      var ms = new Date() - start;
      //console.log('%s %s - %s', this.method, this.url, ms);
    });

    app.use(route.get('/summary/:level', function* (level) {
      this.body = yield local(level | 0);
    }));

    var deferred = q.defer();
    app.listen(process.env.LISTEN, function(err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });
    return deferred.promise;
  }
}).then(function () {

  /* Inter process communication */

  var client = net.connect({ port: process.env.LOOP });
  client.setEncoding('UTF-8');

  function replyGet() {
    var values = [];
    for (var key in data) {
      values.push(key + ':' + data[key]);
    }
    client.write(values.join(',') + '\r\n');
  }
  function handlePut(key, value) {
    data[key] = value;
    replyGet();
  }
  function handleDelete(key) {
    delete data[key];
    replyGet();
  }
  function handleClear() {
    data = {};
    replyGet();
  }
  function handleSync() {
    return resolve().then(function (difference) {
      difference.removed.forEach(function (i) {
        var item = i.split(':');
        delete data[item[0]];
      });
      difference.added.forEach(function (i) {
        var item = i.split(':');
        data[item[0]] = item[1];
      });
    }).then(replyGet, function (err) {
      console.log('Error during synchronization: ', err);
    });
  }

  var conf = { GET: replyGet, PUT: handlePut, DELETE: handleDelete, SYNC: handleSync, CLEAR: handleClear };
  function handleLine(line) {
    var tokens = line.split(' ');
    conf[tokens[0]].apply(null, tokens.slice(1));
  }

  var buff = '';
  client.on('data', function(data) {
    buff += data;
    var lines = buff.split('\r\n');
    for (var i = 0; i < lines.length - 1; i++) {
      handleLine(lines[i]);
    }
    buff = lines[lines.length - 1];
  });
});
