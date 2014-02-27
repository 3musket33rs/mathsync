(function () {
  'use strict';

  var Buffer = require('buffer').Buffer;

  function serializeArray(arr) {
    return new Buffer(new Int8Array(arr)).toString('base64');
  }

  function deserializeString(str) {
    return new Int8Array(new Buffer(str, 'base64').toJSON().data).buffer;
  }

  module.exports = {
    serializeArray: serializeArray,
    deserializeString: deserializeString
  };
})();
