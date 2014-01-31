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

var client = net.connect({ port: process.env.LOOP });
client.setEncoding('UTF-8');

function handlePut(key, value) {
  data[key] = value;
  handleGet();
}
function handleDelete(key) {
  delete data[key];
  handleGet();
}
function handleSync() {
  return resolve().then(function (difference) {
    difference.removed.forEach(function (i) {
      delete data[i.key];
    });
    difference.added.forEach(function (i) {
      data[i.key] = i.value;
    });
  }).then(handleGet, function (err) {
    console.log('Error during synchronization: ', err);
  });
}
function handleGet() {
  var values = [];
  for (var key in data) {
    values.push(key + ':' + data[key]);
  }
  client.write(values.join(',') + '\n');
}

var conf = { GET: handleGet, PUT: handlePut, DELETE: handleDelete, SYNC: handleSync };
function handleLine(line) {
  var tokens = line.split(' ');
  conf[tokens[0]].apply(null, tokens.slice(1));
}

var buff = '';
client.on('data', function(data) {
  buff += data;
  var lines = buff.split('\n');
  for (var i = 0; i < lines.length - 1; i++) {
    handleLine(lines[i]);
  }
  buff = lines[lines.length - 1];
});
