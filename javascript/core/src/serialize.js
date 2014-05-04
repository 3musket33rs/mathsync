(function () {
  'use strict';

  /**
   * Serializer and deserializer interfaces.
   *
   * @class Serial
   */
  /**
   * Serializes objects to arrays of bytes.
   *
   * <p>Any instance of <code>T</code> must be accepted and have a non <code>null</code> return value:
   * for any <code>o</code>, <code>o instanceof T</code> implies <code>serialize(o) != null</code>.</p>
   *
   * <p>The output must be consistent, an identical output should be returned if called twice on the equal
   * objects.</p>
   *
   * @name Serial~Serialize
   * @function
   * @param {T} item - the item to serialize.
   * @return {external:ArrayBuffer} the serialized item.
   */
  /**
   * Deserializes an array of bytes back to an object.
   *
   * <p>Any array of bytes should lead to either a non <code>null</code> value or throw.</p>
   *
   * <p>The output must be consistent, an identical output should be returned if called twice
   * on the identical arrays.</p>
   *
   * @name Serial~Deserialize
   * @function
   * @param {external:ArrayBuffer} content - the array of bytes representing an object.
   * @return {T} the object deserialized from the array of bytes.
   * @throws {external:Error} in case the buffer cannot be read.
   */

  var Buffer = require('buffer').Buffer;

  function identity(t) {
    return t;
  }
  function fromString(func) {
    func = func || identity;
    return function serialize(item) {
      var str = func(item);
      var buffer = new Buffer(str, 'utf-8');
      return new Uint8Array(buffer).buffer;
    };
  }

  function toString(func) {
    func = func || identity;
    return function serialize(buff) {
      var b = new Buffer(new Uint8Array(buff));
      var str = b.toString('utf-8');
      return func(str);
    };
  }

  /**
   * @module serialize
   */
  module.exports = {

    /**
     * Serializes string view of objects to bytes.
     *
     * @function
     * @param {Function} func - translates objects to string before serializing them, can be skipped if the item is already a string.
     * @return {Serial~Serialize} a serializer function which converts objects to string and take the bytes out of the string.
     */
    fromString: fromString,

    /**
     * Deserializes objects from bytes to a string view.
     *
     * @function
     * @param {Function} func - retrieves an object corresponding to the input string view, can be skipped if target type is string.
     * @return {Serial~Deserialize} a deserializer function which reads strings from byte arrays and converts them to objects.
     */
    toString: toString
  };
})();
