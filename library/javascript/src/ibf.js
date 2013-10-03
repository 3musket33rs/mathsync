(function () {
  'use strict';

  function initBuffers(size) {
    var buffers = [];
    for (var i = 0; i < size; i++) {
      buffers.push({ items : 0, hashed : [], xored : [] });
    }
    return buffers;
  }

  function ibf(size) {
    var buffers = initBuffers(size);

    function toJson() {
      return buffers;
    }

    return {
      toJson: toJson
    };
  }

  module.exports = ibf;
})();
