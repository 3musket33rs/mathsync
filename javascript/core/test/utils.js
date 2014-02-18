(function () {
  'use strict';

  var assert = require('assert');
  var _ = require('underscore');

  function assertEqual(array1, array2) {
    var v1 = new Int8Array(array1);
    var v2 = new Int8Array(array2);
    assert.strictEqual(v1.length, v2.length, 'Arrays do not have the same length');
    for (var i = 0; i < v1.length; i++) {
      assert.strictEqual(v1[i], v2[i], 'Item at ' + i + ' differs: ' + v1[i] + ' vs ' + v2[i]);
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

  function assertThatSetOfArrayEquals(arr1, arr2) {
    assert.equal(arr1.length, arr2.length);
    assert.ok(_(arr1).every(function (item1) {
      return _(arr2).some(function (item2) {
        return _.isEqual(item1, item2);
      });
    }));
  }

  module.exports = {
    assertThatSetOfArrayEquals : assertThatSetOfArrayEquals,
    assertEqual: assertEqual,
    isEqual : isEqual
  };
})();
