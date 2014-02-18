(function () {
  'use strict';

  var assert = require('assert');
  var _ = require('underscore');
  var utils = require('./utils');

  var selector = require('../src/bucketSelector');

  function assertThatSetOfArrayEquals(arr1, arr2) {
    assert.equal(arr1.lenght, arr2.lenght);
    assert.ok(_(arr1).every(function (item1) {
      return _(arr2).some(function (item2) {
        return _.isEqual(item1, item2);
      });
    }));
  }

  function intToBytes(i) {
    var int8arr = new Int8Array(4);
    int8arr[0] = ((i >> 24) & 0xff);
    int8arr[1] = ((i >> 16) & 0xff);
    int8arr[2] = ((i >> 8) & 0xff);
    int8arr[3] = (i & 0xff);
    return int8arr.buffer;
  }

  describe('Bucket selector', function() {
    describe('pad and hash', function() {

      it('should return indexes taken from padded hash', function() {
        function digester(content) {
          if (utils.isEqual(content, new Int8Array([5, 0]).buffer)) {
            return intToBytes(2);
          } else if (utils.isEqual(content, new Int8Array([5, 1]).buffer)) {
            return intToBytes(3);
          } else if (utils.isEqual(content, new Int8Array([5, 2]).buffer)) {
            return intToBytes(4);
          }
        }
        var selected = selector.padAndHash(digester, 3)(new Int8Array([5]).buffer);
        assertThatSetOfArrayEquals(selected, [2, 3, 4]);
      });

      it('should return absolute indexes taken from padded hash', function() {
        function digester(content) {
          if (utils.isEqual(content, new Int8Array([5, 0]).buffer)) {
            return intToBytes(-1);
          } else if (utils.isEqual(content, new Int8Array([5, 1]).buffer)) {
            return intToBytes(3);
          } else if (utils.isEqual(content, new Int8Array([5, 2]).buffer)) {
            return intToBytes(-5);
          }
        }
        var selected = selector.padAndHash(digester, 3)(new Int8Array([5]).buffer);
        assertThatSetOfArrayEquals(selected, [1, 3, 5]);
      });
    });
  });
})();
