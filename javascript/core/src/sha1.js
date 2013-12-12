(function () {
  'use strict';

  var digest = require('crypto-js/sha1');
  var WordArray = require('crypto-js/lib-typedarrays').init;

  function sha1(source) {
    if (!(source instanceof ArrayBuffer)) {
      throw new TypeError('Cannot digest source: ' + source);
    }
    var wordArray = new WordArray(source);
    var digested = digest(wordArray);
    var int32view = new Int32Array(digested.words);
    return int32view.buffer;
  }

  module.exports = sha1;
})();
