(function () {
  'use strict';

  var Rusha = require('rusha');
  var rusha = new Rusha();

  function sha1(source) {
    if (!(source instanceof ArrayBuffer)) {
      throw new TypeError('Cannot digest source: ' + source);
    }
    return rusha.rawDigest(source).buffer.slice(0, 20);
  }

  module.exports = sha1;
})();
