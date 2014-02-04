(function () {
  'use strict';

  function intFromDigestedBytes(digested) {
    var int8arr = new Int8Array(digested);
    return ((int8arr[0] << 24) | (int8arr[1] << 16) | (int8arr[2] << 8) | (int8arr[3]));
  }

  function padAndHash(digest, spread) {
    return function (content) {
      var selected = [];
      var bucketId;
      var copy = new Int8Array(content.byteLength + 1);
      copy.set(new Int8Array(content));
      for (var i = 0; i < spread; i++) {
        copy[copy.length - 1] = i;
        bucketId = intFromDigestedBytes(digest(copy.buffer));
        selected.push(Math.abs(bucketId));
      }
      return selected;
    };
  }

  module.exports = {
    padAndHash: padAndHash
  };
})();
