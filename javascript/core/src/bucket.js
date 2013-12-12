(function () {
  'use strict';

  var Buffer = require('buffer').Buffer;

  function xorArrays(array1, array2) {
    array1 = new Int8Array(array1);
    array2 = new Int8Array(array2);

    var xored = new Int8Array(Math.max(array1.length, array2.length));
    for (var i = 0; i < xored.length; i++) {
      xored[i] = (array1[i] || 0) ^ (array2[i] || 0)
    }

    return xored.buffer;
  }

  function serializeArray(arr) {
    return new Buffer(new Int8Array(arr)).toString('base64');
  }

  function deserializeString(str) {
    return new Int8Array(new Buffer(str, 'base64').toJSON().data).buffer;
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
      group : group,
      items : items,
      xored : xored,
      hashed : hashed,
      toJSON : toJSON,
      modify : modify
    };
  }

  var emptyBucket = bucket(0, new ArrayBuffer(0), new ArrayBuffer(0));

  function fromJSON(json) {
    return bucket(json.items, deserializeString(json.xored), deserializeString(json.hashed));
  }

  emptyBucket.fromJSON = fromJSON;

  module.exports = emptyBucket;
})();
