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

  function bucket(items, hashed, xored) {
    items = items || 0;
    hashed = hashed || [];
    xored = xored || [];

    function modify(variation, content, digested) {
      return bucket(items + variation, xorArrays(digested, hashed), xorArrays(content, xored));
    }

    function toJson() {
      return { items: items, hashed: hashed, xored: xored };
    }

    return {
      modify: modify,
      toJson: toJson
    };
  }

  function bucketsOfSize(size) {
    var buckets = [];
    for (var i = 0; i < size; i++) {
      buckets.push(bucket());
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
