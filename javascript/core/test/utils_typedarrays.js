(function () {
  'use strict';

  var assert = require('assert');

  function assertEqual(array1, array2) {
    var v1 = new Int8Array(array1);
    var v2 = new Int8Array(array2);
    assert.strictEqual(v1.length, v2.length, 'Arrays do not have the same length');
    for (var i = 0; i < v1.length; i++) {
      assert.strictEqual(v1.length, v2.length, 'Item at ' + i + ' differs');
    }
  }

  function isEqual(array1, array2) {
    var v1 = new Int8Array(array1);
    var v2 = new Int8Array(array2);
    if (v1.length !== v2.length) {
      return false;
    }
    for (var i = 0; i < v1.length; i++) {
      if (v1[i] !== v2[i]) {
        return false;
      }
    }
    return true;
  }

  module.exports = {
    assertEqual: assertEqual,
    isEqual : isEqual
  }
})();
