(function () {
  'use strict';

  var Buffer = require('buffer').Buffer;

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

  function serializeArray(arr) {
    return new Buffer(arr).toString('base64');
  }

  function deserializeString(str) {
    return new Buffer(str, 'base64').toJSON().data;
  }

  function bucket(count, xor, hash) {

    function items() {
      return count;
    }

    function xored() {
      return xor;
    }

    function hashed() {
      return hash;
    }

    function modify(variation, content, digest) {
      return bucket(count + variation, xorArrays(xor, content), xorArrays(hash, digest));
    }

    function group(other) {
      return modify(other.items(), other.xored(), other.hashed());
    }

    function toJSON() {
      return {
        items: count,
        hashed: serializeArray(hash),
        xored: serializeArray(xor)
      };
    }

    return {
      _group : group,
      items : items,
      xored : xored,
      hashed : hashed,
      toJSON : toJSON,
      modify : modify
    };
  }

  var emptyBucket = bucket(0, [], []);

  function fromJSON(json) {
    return bucket(json.items, deserializeString(json.xored), deserializeString(json.hashed));
  }

  emptyBucket.fromJSON = fromJSON;

  module.exports = emptyBucket;
})();
