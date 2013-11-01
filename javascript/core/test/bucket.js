(function () {
  'use strict';

  var assert = require('assert');

  var emptyBucket = require('../src/bucket');

  var content1 = [1, 2];
  var hash1 = [3, 4];
  var added1 = emptyBucket.modify(1, content1, hash1);

  var content2 = [5, 6];
  var hash2 = [7, 8];
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
        assert.deepEqual([], emptyBucket.xored());
      });
      it('should be content XOR when modifying items', function() {
        assert.deepEqual(content1, added1.xored());
        assert.deepEqual(content2, added2.xored());
        assert.deepEqual([1 ^ 5, 2 ^ 6], added1removed2.xored());
      });
    });
    describe('hashed', function() {
      it('should be empty array by default', function() {
        assert.deepEqual([], emptyBucket.hashed());
      });
      it('should be hash XOR when modifying items', function() {
        assert.deepEqual(hash1, added1.hashed());
        assert.deepEqual(hash2, added2.hashed());
        assert.deepEqual([3 ^ 7, 4 ^ 8], added1removed2.hashed());
      });
    });
  });
})();
