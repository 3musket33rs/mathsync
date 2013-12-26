var http = require('http');
var q = require('q');

var data = [];

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

var summarizer = require('mathsync/src/summarizer');
var sha1 = require('mathsync/src/sha1');
var local = summarizer.fromItems(data, serialize, sha1, 3);
var remote = summarizer.fromJSON(fetchSummary, sha1, 3);
var resolve = require('mathsync/src/resolver').fromSummarizers(local, remote, deserialize);

resolve().done(function (difference) {
  console.log(difference);
}, function (err) {
  throw err;
});
