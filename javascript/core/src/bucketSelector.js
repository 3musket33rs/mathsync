(function () {
  'use strict';

  /**
   * Bucket selector interface.
   *
   * @class BucketSelector
   */
  /**
   * Selects buckets to store items in.
   *
   * <p>This interface leaks internal details about summary structure. One can implement and use custom instances to
   * customize settings but be ready for major changes in following versions.</p>
   *
   * <p>The output array must contain integers between <code>0</code> and <code>Integer.MAX_VALUE</code>. It is better
   * if all integers in that range have the same probability of appearance.</p>
   *
   * <p>The output must be consistent, for any byte array<code>content</code>, for any positive integer <code>b</code>,
   * multiple invocations of <code>selectBuckets(b, content)</code> must return the same array.</p>
   *
   * <p>Different seed values should lead to different resulting arrays.</p>
   *
   * <p>The number of returned buckets may vary for different contents and the returned array may contain
   * duplicates.</p>
   *
   * @name BucketSelector~Selector
   * @function
   * @param {number} seed a seed preventing items to fall in the same buckets at all compression levels.
   * @param {external:ArrayBuffer} item - the item to serialize.
   * @return {number[]} buckets to store the item in.
   */

  var BYTES_PER_INT = 4;

  function bytesToInt(buffer) {
    var dv = new DataView(buffer);
    var buckets = [];
    for (var i = 0; i < buffer.byteLength; i += BYTES_PER_INT) {
      buckets.push(Math.abs(dv.getInt32(i)));
    }
    return buckets;
  }

  function padAndHash(digest, spread) {
    return function (seed, content) {
      var hashed;

      var remaining = spread * BYTES_PER_INT;
      var pointer = 0;
      var bucketsBytes = new Int8Array(remaining);

      var copy = new Int8Array(content.byteLength + BYTES_PER_INT);
      copy.set(new Int8Array(content));
      var dv = new DataView(copy.buffer);

      var pad = seed;
      while (true) {
        dv.setInt32(content.byteLength, pad++);
        hashed = new Int8Array(digest(copy.buffer));
        if (hashed.byteLength < remaining) {
          bucketsBytes.set(hashed, pointer);
          pointer += hashed.byteLength;
          remaining -= hashed.byteLength;
        } else {
          bucketsBytes.set(hashed.subarray(0, remaining), pointer);
          return bytesToInt(bucketsBytes.buffer);
        }
      }
    };
  }

  /**
   * @module bucketSelector
   */
  module.exports = {

    /**
     * Selects multiple buckets to store items in by padding items and digesting them.
     *
     * @function
     * @param {digester} digest - digester for padded items.
     * @param {number} spread - the number of buckets to return.
     * @return {bucketSelector} a bucket selector.
     */
    padAndHash: padAndHash
  };
})();
