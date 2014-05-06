(function () {
  'use strict';

  /**
   * Summarizer interface.
   *
   * @class Summarizer
   */
  /**
   * Produces a summary at a given level of detail.
   *
   * <p>The larger detail level is, the bigger summary will consume on the wire, but the more
   * information it conveys.</p>
   *
   * @name Summarizer~Summarizer
   * @function
   * @param {number} level - the level of detail.
   * @return {external:Promise.<external:Summary>} a promise resolving to a summary of the
   *                                         current state at the requested level of detail.
   */

  var Promise = require('./promise');
  var ibfBuilder = require('./ibf');
  var emptyFullContent = require('./fullContent');
  var iterator = require('./iterator');
  var generator = require('./generator');

  function levelToSize(level) {
    return Math.pow(2, level);
  }

  function fromItems(array, serialize, digest, selector) {
    return function (level) {
      var size = levelToSize(level);
      var empty;
      if (size > array.length) {
        empty = emptyFullContent;
      } else {
        empty = ibfBuilder(size, digest, selector);
      }
      var it = iterator.map(iterator.fromArray(array), serialize);
      return empty.plusIterator(it);
    };
  }

  function fromJSON(producer, digest, selector) {
    return function (level) {
      return Promise.resolve(producer(level)).then(function (json) {
        if (Array.isArray(json)) {
          return ibfBuilder.fromJSON(json, digest, selector);
        } else {
          return emptyFullContent.fromJSON(json);
        }
      });
    };
  }

  function fromStream(streamer, serialize, digest, selector) {
    return function (level) {
      var size = levelToSize(level);
      var empty = ibfBuilder(size, digest, selector);
      return empty.plusStream(streamer(), serialize);
    };
  }

  /**
   * @module summarizer
   */
  module.exports = {

    /**
     * Creates summaries representing an array.
     *
     * @function
     * @param {Object[]} array - the array of items in the current state.
     * @param {Serial~Serialize} serialize - a serializer for items in the array.
     * @param {digester} digest - a message digester to build summaries.
     * @param {bucketSelector} selector - the bucket selector to build summaries.
     * @return {summarizer} a summarizer returning summaries representing the given array.
     */
    fromItems : fromItems,

    /**
     * Deserializes JSON views of summaries, likely obtained throught the network.
     *
     * @function
     * @param {Function} producer - the producer of JSON summaries, returns promises resolving to JSON content.
     * @param {digester} digest - a message digester to build summaries.
     * @param {bucketSelector} selector - the bucket selector to build summaries.
     * @return {summarizer} a summarizer returning deserialized summaries.
     */
    fromJSON : fromJSON,

    /**
     * Creates summaries representing a stream of data.
     *
     * @function
     * @param {function} streamer - function returning a new {@link external:Readable stream} every time it is called.
     * @param {Serial~Serialize} serialize - a serializer for items in the array.
     * @param {digester} digest - a message digester to build summaries.
     * @param {bucketSelector} selector - the bucket selector to build summaries.
     * @return {summarizer} a summarizer returning summaries containing emitted items.
     */
    fromStream : fromStream,

    /**
     * Creates summaries representing items yielded by a generator.
     *
     * @function
     * @param {external:Generator} generator - the generator that will yield all items.
     * @param {Serial~Serialize} serialize - a serializer for yielded items.
     * @param {digester} digest - a message digester to build summaries.
     * @param {bucketSelector} selector - the bucket selector to build summaries.
     * @return {summarizer} a summarizer returning summaries representing the yielded items.
     */
    fromGenerator : generator.newSummarizer
  };
})();
