(function () {
  'use strict';

  var Rusha = require('rusha');
  var rusha = new Rusha();

  /**
   * SHA-1 digester.
   *
   * @param {ArrayBuffer} source - the source to digest.
   * @return {ArrayBuffer} the digested content.
   * @exports sha1
   * @function
   */
  module.exports = function sha1(source) {
    if (!(source instanceof ArrayBuffer)) {
      throw new TypeError('Cannot digest source: ' + source);
    }
    return rusha.rawDigest(source).buffer.slice(0, 20);
  };

})();
