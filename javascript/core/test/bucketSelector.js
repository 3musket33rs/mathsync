(function () {
  'use strict';

  var assert = require('assert');
  var _ = require('underscore');
  var utils = require('./utils_typedarrays');

  var selector = require('../src/bucketSelector');

  function assertThatSetOfArrayEquals(arr1, arr2) {
    assert.equal(arr1.lenght, arr2.lenght);
    assert.ok(_(arr1).every(function (item1) {
      return _(arr2).some(function (item2) {
        return _.isEqual(item1, item2);
      });
    }));
  }

  describe('Bucket selector', function() {
    describe('pad and hash', function() {

      it('should return indexes taken from padded hash', function() {
        function digester(content) {
          if (utils.isEqual(content, new Int8Array([5, 0]).buffer)) {
            return new Int32Array([2]).buffer;
          } else if (utils.isEqual(content, new Int8Array([5, 1]).buffer)) {
            return new Int32Array([3]).buffer;
          } else if (utils.isEqual(content, new Int8Array([5, 2]).buffer)) {
            return new Int32Array([4]).buffer;
          }
        }
        var selected = selector.padAndHash(digester, 3)(10, new Int8Array([5]).buffer);
        assertThatSetOfArrayEquals(selected, [2, 3, 4]);
      });

      it('should return indexes taken from padded hash modulo size', function() {
        function digester(content) {
          if (utils.isEqual(content, new Int8Array([5, 0]).buffer)) {
            return new Int32Array([-1]).buffer;
          } else if (utils.isEqual(content, new Int8Array([5, 1]).buffer)) {
            return new Int32Array([3]).buffer;
          } else if (utils.isEqual(content, new Int8Array([5, 2]).buffer)) {
            return new Int32Array([12]).buffer;
          }
        }
        var selected = selector.padAndHash(digester, 3)(10, new Int8Array([5]).buffer);
        assertThatSetOfArrayEquals(selected, [9, 3, 2]);
      });
    });
  });
})();
