var http = require('http');
var q = require('q');
var net = require('net');

var data = {};

function serialize(item) {
  var buffer = new Buffer(item.key + ':' + item.value, 'utf-8');
  return new Uint8Array(buffer).buffer;
}
function deserialize(buffer) {
  var str = new Buffer(new Uint8Array(buffer)).toString('utf-8');
  var arr = str.split(':');
  return { key: arr[0], value: arr[1] };
}

var baseUrl = 'http://localhost:' + process.env.PORT + '/summary/';
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

var ms = require('mathsync-generator');

var local = ms.summarizer.fromGenerator(function* () {
  for (var k in data) {
    yield { key: k, value: data[k] };
  }
}, serialize);

var remote = ms.summarizer.fromJSON(fetchSummary);

var resolve = ms.resolver.fromSummarizers(local, remote, deserialize);

/* IPC with cucumber */

function handleLine(line) {
  var tokens = line.split(' ');
  if (tokens[0] === 'PUT') {
    data[tokens[1]] = tokens[2];
  } else if (tokens[0] === 'DELETE') {
    delete data[tokens[1]];
  } else if (tokens[0] === 'SYNC') {
    resolve().then(function (difference) {
      var i;
      var removed = difference.removed;
      for (i = 0; i < removed.length; i++) {
        delete data[removed[i].key];
      }
      var added = difference.added;
      for (i = 0; i < added.length; i++) {
        data[added[i].key] = added[i].value;
      }
    }).then(function () {
      var values = [];
      for (var key in data) {
        values.push(key + ':' + data[key]);
      }
      client.write(values.join(',') + '\n');
    }, function (err) {
      console.log(err);
    });
  }
}
var client = net.connect({ port: process.env.LOOP });
client.setEncoding('UTF-8');
var buff = '';
client.on('data', function(data) {
  buff += data;
  var lines = buff.split('\n');
  for (var i = 0; i < lines.length - 1; i++) {
    handleLine(lines[i]);
  }
  buff = lines[lines.length - 1];
});
