(function () {
  'use strict';

  var Buffer = require('buffer').Buffer;

  function levelToSize(level) {
    return Math.pow(2, level);
  }

  function serializeArray(arr) {
    return new Buffer(new Int8Array(arr)).toString('base64');
  }

  function deserializeString(str) {
    return new Int8Array(new Buffer(str, 'base64').toJSON().data).buffer;
  }

  module.exports = {
    levelToSize: levelToSize,
    serializeArray: serializeArray,
    deserializeString: deserializeString
  };
})();
