'use strict';

var skeleton = require('./skeleton');

function updaterFromArray(array) {
  function updater(item, done) {
    array.forEach(item);
    done();
  }

  return updater;
}

function newSummarizer(array, serialize, digest, selector) {
  return skeleton.newSummarizer(updaterFromArray(array), serialize, digest, selector);
}

function newResolver(array, remote, serialize, deserialize) {
  return skeleton.newResolver(updaterFromArray(array), remote, serialize, deserialize);
}

/**
 * Array handling.
 *
 * @module mathsync/array
 */
module.exports = {

  /**
   * Creates a new summarizer.
   *
   * @example
   * var items = [{ from: 1, to: 2 }, { from: 2, to: 5}];
   * function serialize(item) {
   *   return new Int32Array([item.from, item.to]).buffer;
   * }
   * var summarizer = require('mathsync/array').newSummarizer(items, serialize);
   *
   * @name module:mathsync/array.newSummarizer
   * @function
   * @param {Object[]} array - the array containing local items.
   * @param {Serial~Serialize} serialize - the item serializer.
   * @param {Digest~Digester} [digester] - the digester to use, defaults to SHA-1.
   * @param {BucketSelector~Selector} [selector] - how to place items in IBF buckets, uses 3 buckets by default.
   */
  newSummarizer : newSummarizer,

  /**
   * Creates a new resolver.
   *
   * @example
   * var remote = ...
   * var items = [{ from: 1, to: 2 }, { from: 2, to: 5}];
   * function serialize(item) {
   *   return new Int32Array([item.from, item.to]).buffer;
   * }
   * function deserialize(buffer) {
   *   var arr = new Int32Array(buffer);
   *   return { from: arr[0], to: arr[1] };
   * }
   * var summarizer = require('mathsync/array').newResolver(items, remote, serialize, deserialize);
   *
   * @name module:mathsync/array.newResolver
   * @function
   * @param {Object[]} array - the array containing local items.
   * @param {Summarizer} remote - summarizer producing summaires of the remote side.
   * @param {Serial~Serialize} serialize - the item serializer.
   * @param {Serial~Deserialize} deserialize - the item deserializer.
   */
  newResolver : newResolver
};
