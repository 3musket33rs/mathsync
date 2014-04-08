(function () {
  'use strict';

  /**
   * Function interface - Selects buckets to store items in.
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
   * @external bucketSelector
   * @function
   * @param {number} seed a seed preventing items to fall in the same buckets at all compression levels.
   * @param {external:ArrayBuffer} item - the item to serialize.
   * @return {number[]} buckets to store the item in.
   */

  function intFromDigestedBytes(digested) {
    var int8arr = new Int8Array(digested);
    return ((int8arr[0] << 24) | (int8arr[1] << 16) | (int8arr[2] << 8) | (int8arr[3]));
  }

  function padAndHash(digest, spread) {
    return function (seed, content) {
      var selected = [];
      var bucketId;
      var copy = new Int8Array(content.byteLength + 4);
      copy.set(new Int8Array(content));
      var dv = new DataView(copy.buffer);
      for (var i = 0; i < spread; i++) {
        dv.setInt32(content.byteLength, seed + i);
        bucketId = intFromDigestedBytes(digest(copy.buffer));
        selected.push(Math.abs(bucketId));
      }
      return selected;
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
