(function () {
  'use strict';

  var b64 = require('base64-arraybuffer');

  /**
   * Serializes and deserializes byte arrays to and from strings.
   *
   * @see {@link https://www.npmjs.org/package/base64-arraybuffer|base64-arraybuffer, inlined because latest version is not published}
   * @module arrayBufferSerialization
   */
  module.exports = {

    /**
     * Serializes an ArrayBuffer to a string.
     *
     * @function
     * @param {ArrayBuffer} buffer - the buffer to serialize.
     * @return {string} a string representing buffer content.
     */
    toString: b64.encode,

    /**
     * Deserializes a string to an ArrayBuffer
     *
     * @function
     * @param {string} content - the serialized string to decode.
     * @return {ArrayBuffer} a buffer corresponding to the string.
     */
    fromString: b64.decode
  };
})();
