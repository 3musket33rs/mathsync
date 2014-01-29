var http = require('http');
var q = require('q');

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

resolve().done(function (difference) {
  console.log(difference);
}, function (err) {
  throw err;
});
