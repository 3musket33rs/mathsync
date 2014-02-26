(function () {
  'use strict';

  /**
   * Function interface - Digests an item serialized as an array of bytes.
   *
   * <p>Any byte array value must be accepted and have a non <code>null</code> return value: for any <code>a</code>,
   * <code>digester(a) != null</code>.</p>
   *
   * <p>All valid inputs should produce in output an array of the same size:for any <code>a1</code> and
   * <code>a2</code>, <code>digester(a1).byteLength == digester(a2).byteLength</code>.</p>
   *
   * <p>The output must be consistent, an identical output should be returned if called twice on the same array: for
   * any <code>a1</code> and <code>a2</code>, <code>Arrays.equals(a1, a2)</code> implies
   * <code>Arrays.equals(digester(a1), digester(a2))</code>.</p>
   *
   * <p>In addition to those constrains, it is recommended that it has the properties of a
   * <a href="http://en.wikipedia.org/wiki/Cryptographic_hash_function">cryptographic hash function</a>.</p>
   *
   * @external digester
   * @function
   * @param {external:ArrayBuffer} item - the item to digest.
   * @return {external:ArrayBuffer} the message digest of the item.
   */

  var Rusha = require('rusha');
  var rusha = new Rusha();

  function sha1(source) {
    if (!(source instanceof ArrayBuffer)) {
      throw new TypeError('Cannot digest source: ' + source);
    }
    return rusha.rawDigest(source).buffer;
  }

  module.exports = sha1;
})();
