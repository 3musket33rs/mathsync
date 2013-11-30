(function () {
  'use strict';

  var emptyBucket = require('./bucket');

  function arrayCopy(array) {
    var copy = [];
    for (var i = 0; i < array.length; i++) {
      copy.push(array[i]);
    }
    return copy;
  }

  function bucketsOfSize(size) {
    var buckets = [];
    for (var i = 0; i < size; i++) {
      buckets.push(emptyBucket);
    }
    return buckets;
  }

  function ibf(size, spread, digest) {
    var buckets = bucketsOfSize(size);

    function toJson() {
      var json = [];
      buckets.forEach(function (bucket) {
        json.push(bucket.toJson());
      });
      return json;
    }

    function addItem(content) {
      var bucketId;
      var digested = digest(content);
      var copy = arrayCopy(content);
      copy.push(0);
      for (var i = 0; i < spread; i++) {
        copy[copy.length - 1] = i;
        bucketId = digest(copy)[0] % size;
        buckets[bucketId] = buckets[bucketId].modify(1, content, digested);
      }
    }

    return {
      toJson : toJson,
      addItem : addItem
    };
  }

  module.exports = ibf;
})();
