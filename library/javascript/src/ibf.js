(function () {
  'use strict';

  function arrayCopy(array) {
    var copy = [];
    for (var i = 0; i < array.length; i++) {
      copy.push(array[i]);
    }
    return copy;
  }

  function xorArrays(array1, array2) {
    var l = Math.max(array1.length, array2.length);
    var v1;
    var v2;
    var xored = [];
    for (var i = 0; i < l; i++) {
      v1 = (array1[i] || 0) & 0xff;
      v2 = (array2[i] || 0) & 0xff;
      xored.push(v1 ^ v2);
    }
    return xored;
  }

  function initBuckets(size) {
    var buckets = [];
    for (var i = 0; i < size; i++) {
      buckets.push({ items : 0, hashed : [], xored : [] });
    }
    return buckets;
  }

  function ibf(size, spread, digest) {
    var buckets = initBuckets(size);

    function toJson() {
      return buckets;
    }

    function addItem(content) {
      var bucketId;
      var bucket;
      var copy = arrayCopy(content);
      copy.push(0);
      for (var i = 0; i < spread; i++) {
        copy[copy.length - 1] = i;
        bucketId = digest(copy)[0] % size;
        bucket = buckets[bucketId];
        bucket.items++;
        bucket.xored = xorArrays(bucket.xored, content);
        bucket.hashed = xorArrays(bucket.hashed, digest(content));
      }
    }

    return {
      toJson : toJson,
      addItem : addItem
    };
  }

  module.exports = ibf;
})();
