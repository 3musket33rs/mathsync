(function () {
  'use strict';

  var Buffer = require('buffer').Buffer;

  function toString(arr) {
    return new Buffer(new Int8Array(arr)).toString('base64');
  }

  function fromString(str) {
    return new Int8Array(new Buffer(str, 'base64').toJSON().data).buffer;
  }

  module.exports = {
    toString: toString,
    fromString: fromString
  };
})();
