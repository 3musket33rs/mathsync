'use strict';

var b64 = require('base64-arraybuffer');

module.exports = {

  /**
   * Serializes an ArrayBuffer to a string.
   *
   * @function
   * @param {external:ArrayBuffer} buffer - the buffer to serialize.
   * @return {string} a string representing buffer content.
   */
  toString: b64.encode,

  /**
   * Deserializes a string to an ArrayBuffer
   *
   * @function
   * @param {string} content - the serialized string to decode.
   * @return {external:ArrayBuffer} a buffer corresponding to the string.
   */
  fromString: b64.decode
};
