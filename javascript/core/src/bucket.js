(function () {
  'use strict';

  var defaults = require('./defaults');

  function isArrayEmpty(array) {
    array = new Int8Array(array);
    for (var i = 0; i < array.length; i++) {
      if (array[i] !== 0) {
        return false;
      }
    }
    return true;
  }

  function xorArrays(array1, array2) {
    array1 = new Int8Array(array1);
    array2 = new Int8Array(array2);

    var xored = new Int8Array(Math.max(array1.length, array2.length));
    for (var i = 0; i < xored.length; i++) {
      xored[i] = (array1[i] || 0) ^ (array2[i] || 0);
    }

    return xored.buffer;
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
      return [count, defaults.serializeArray(xor), defaults.serializeArray(hash)];
    }

    function isEmpty() {
      return (count === 0) && (isArrayEmpty(hash));
    }

    return {
      group : group,
      items : items,
      xored : xored,
      hashed : hashed,
      isEmpty : isEmpty,
      toJSON : toJSON,
      modify : modify
    };
  }

  var emptyBucket = bucket(0, new ArrayBuffer(0), new ArrayBuffer(0));

  function fromJSON(json) {
    return bucket(json[0], defaults.deserializeString(json[1]), defaults.deserializeString(json[2]));
  }

  emptyBucket.fromJSON = fromJSON;

  module.exports = emptyBucket;
})();
