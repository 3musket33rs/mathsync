(function () {
  'use strict';

  var assert = require('assert');

  var emptyBucket = require('../src/bucket');
  var utils = require('./utils_typedarrays');

  var content1 = new Int8Array([1, 2]).buffer;
  var hash1 = new Int8Array([3, 4]).buffer;
  var added1 = emptyBucket.modify(1, content1, hash1);

  var content2 = new Int8Array([5, 6]).buffer;
  var hash2 = new Int8Array([7, 8]).buffer;
  var added2 = emptyBucket.modify(2, content2, hash2);

  var added1removed2 = added1.modify(-2, content2, hash2);

  describe('Bucket', function() {
    describe('item number', function() {
      it('should be 0 by default', function() {
        assert.equal(0, emptyBucket.items());
      });
      it('should be increase when adding items', function() {
        assert.equal(1, added1.items());
        assert.equal(2, added2.items());
      });
      it('should be decrease when removing items', function() {
        assert.equal(-1, added1removed2.items());
      });
    });
    describe('xored', function() {
      it('should be empty array by default', function() {
        utils.assertEqual(new ArrayBuffer(0), emptyBucket.xored());
      });
      it('should be content XOR when modifying items', function() {
        utils.assertEqual(content1, added1.xored());
        utils.assertEqual(content2, added2.xored());
        utils.assertEqual([1 ^ 5, 2 ^ 6], added1removed2.xored());
      });
    });
    describe('hashed', function() {
      it('should be empty array by default', function() {
        utils.assertEqual(new ArrayBuffer(0), emptyBucket.hashed());
      });
      it('should be hash XOR when modifying items', function() {
        utils.assertEqual(hash1, added1.hashed());
        utils.assertEqual(hash2, added2.hashed());
        utils.assertEqual([3 ^ 7, 4 ^ 8], added1removed2.hashed());
      });
    });
  });
})();
