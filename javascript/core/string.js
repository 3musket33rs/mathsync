'use strict';

var Buffer = require('buffer').Buffer;

function identity(t) {
  return t;
}

function newSerializer(func) {
  func = func || identity;

  function serialize(item) {
    var str = func(item);
    var buffer = new Buffer(str, 'utf-8');
    return new Uint8Array(buffer).buffer;
  }

  return serialize;
}

function newDeserializer(func) {
  func = func || identity;

  function deserialize(buff) {
    var b = new Buffer(new Uint8Array(buff));
    var str = b.toString('utf-8');
    return func(str);
  }

  return deserialize;
}

/**
 * String based serialization and deserialization.
 *
 * @module mathsync/string
 */
module.exports = {

  /**
   * Serializes string view of objects to bytes.
   *
   * @function
   * @param {Function} [func] - translates objects to string before serializing them, can be skipped if the item is already a string.
   * @return {Serial~Serialize} a serializer function which converts objects to string and take the bytes out of the string.
   */
  newSerializer: newSerializer,

  /**
   * Deserializes objects from bytes to a string view.
   *
   * @function
   * @param {Function} [func] - retrieves an object corresponding to the input string view, can be skipped if target type is string.
   * @return {Serial~Deserialize} a deserializer function which reads strings from byte arrays and converts them to objects.
   */
  newDeserializer: newDeserializer
};
