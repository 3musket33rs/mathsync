(function () {
  'use strict';

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

    function toJson() {
      return { items: count, hashed: hash, xored: xor };
    }

    return {
      items : items,
      xored : xored,
      hashed : hashed,
      toJson : toJson,
      modify : modify
    };
  }

  module.exports = bucket(0, [], []);
})();
