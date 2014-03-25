(function () {
  'use strict';

  /**
   * The built in ArrayBuffer object.
   *
   * <p>Arraybuffers are the way to represent items serialized in binary format.</p>
   *
   * @external ArrayBuffer
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ArrayBuffer ArrayBuffer on Mozilla Developer Network}
   */

  /**
   * Node's readable stream.
   *
   * <p>Only to be used in object mode.</p>
   *
   * @external Readable
   * @see {@link http://nodejs.org/api/stream.html#stream_class_stream_readable stream.Readable on Node.js}
   */
  /**
   * Data event.
   *
   * <p>Called as soon as data is available, with one item.</p>
   *
   * @example
   * stream.on('data', function(item) {
   *   console.log(item);
   * });
   *
   * @event external:Readable#data
   * @type {Object}
   */
  /**
   * Error event.
   *
   * <p>Called if there is an error while reading data.</p>
   *
   * @example
   * stream.on('error', function(err) {
   *   console.error(err);
   * });
   *
   * @event external:Readable#error
   * @type {Error}
   */
  /**
   * End event.
   *
   * <p>Called after all data has been read.</p>
   *
   * @example
   * stream.on('end', function(err) {
   *   console.log('done with my stream');
   * });
   *
   * @event external:Readable#end
   */

  /**
   * Represents summarized data.
   * @external Summary
   */
  /**
   * Adds an item to the summary.
   *
   * <p>When both summaries can be {@link external:Summary#toDifference|viewed as a difference}:
   * <ul>
   *   <li>if the item is in the removed set of that summary, it is in none of the resulting summary difference sets</li>
   *   <li>if the item is in none of the difference sets of that summary, it is in the added set of the resulting difference</li>
   *   <li>if the item is in the added set of that summary, the resulting summary may be impossible to decipher</li>
   * </ul>
   * </p>
   *
   * @param {external:ArrayBuffer} item - the serialized item.
   * @returns {external:Summary} a new summary instance including this item.
   * @function external:Summary#plus
   */
  /**
   * Adds several items to the summary.
   *
   * <p>Equivalent to repeatedly calling {@link external:Summary#plus} for each element, but this
   * method can do optimizations for batch updates.</p>
   *
   * @param {external:Iterator} iterator - an iterator of items to add.
   * @returns {external:Promise.<external:Summary>} a promise which will resolve to a summary.
   * @function external:Summary#plusIterator
   */
  /**
   * Adds several items to the summary.
   *
   * <p>Equivalent to repeatedly calling {@link external:Summary#plus} for each element, but this
   * method can do optimizations for batch updates.</p>
   *
   * @param {external:Readable<external:ArrayBuffer>} stream - a stream of items to add.
   * @returns {external:Promise.<external:Summary>} a promise which will resolve to a summary.
   * @function external:Summary#plusStream
   */
  /**
   * Removes an item from the summary.
   *
   * <p>When both summaries can be {@link external:Summary#toDifference|viewed as a difference}:
   * <ul>
   *   <li>if the item is in the added set of that summary, it is in none of the resulting summary difference sets</li>
   *   <li>if the item is in none of the difference sets of that summary, it is in the removed set of the resulting difference</li>
   *   <li>if the item is in the removed set of that summary, the resulting summary may be impossible to decipher</li>
   * </ul>
   * </p>
   *
   * @param {external:ArrayBuffer} item - the serialized item.
   * @returns {external:Summary} a new summary instance excluding this item.
   * @function external:Summary#minus
   */
  /**
   * Removes several items from the summary.
   *
   * <p>Equivalent to repeatedly calling {@link external:Summary#minus} for each element, but this
   * method can do optimizations for batch updates.</p>
   *
   * @param {external:Iterator} iterator - an iterator of items to remove.
   * @returns {external:Promise.<external:Summary>} a promise which will resolve to a summary.
   * @function external:Summary#minusIterator
   */
  /**
   * Removes several items from the summary.
   *
   * <p>Equivalent to repeatedly calling {@link external:Summary#minus} for each element, but this
   * method can do optimizations for batch updates.</p>
   *
   * @param {external:Readable<external:ArrayBuffer>} stream - a stream of items to remove.
   * @returns {external:Promise.<external:Summary>} a promise which will resolve to a summary.
   * @function external:Summary#minusStream
   */
  /**
   * Retrieves a view of the summary as a difference.
   *
   * @returns {external:Difference.<external:ArrayBuffer>} a difference view of the summary or <code>null</code> if it cannot be resolved with the information it contains.
   * @function external:Summary#toDifference
   */
  /**
   * Substracts a summary from this one.
   *
   * @param {external:Summary} summary - the summary to substract to this one.
   * @returns {external:Summary} a new summary with the items substracted from this one.
   * @function external:Summary#minus
   * @deprecated
   */
  /**
   * Retrieves a JSON view of the summary.
   *
   * @returns {Object} a JSON view of the summary.
   * @function external:Summary#toJSON
   */

  /**
   * Represents the difference between two states.
   *
   * @external Difference
   */
  /**
   * Represents the set of items added on the remote side compared to the local state.
   *
   * @returns {Array.<T>} the array of items added on the remote side compared to the local state.
   * @function external:Difference#added
   */
  /**
   * Represents the set of items removed on the remote side compared to the local state.
   *
   * @returns {Array.<T>} the array of items removed on the remote side compared to the local state.
   * @function external:Difference#removed
   */

  var sha1 = require('./sha1');
  var summarizer = require('./summarizer');
  var selector = require('./bucketSelector').padAndHash(sha1, 3);

  function fromItems(array, serialize) {
    return summarizer.fromItems(array, serialize, sha1, selector);
  }

  function fromJSON(producer) {
    return summarizer.fromJSON(producer, sha1, selector);
  }

  function fromGenerator(generator, serialize) {
    return summarizer.fromGenerator(generator, serialize, sha1, selector);
  }

  /**
   * Entry point to default instances.
   *
   * @module mathsync
   */
  module.exports = {

    /**
     * Exposes the same members of {@link module:summarizer} with default settings.
     *
     * <p>All summarizers provided here use SHA-1 hashing and a bucket selector putting each item in 3 buckets.</p>
     *
     * @member
     */
    summarizer: {

      /**
       * Creates summaries representing an array.
       *
       * @example <caption>Simple strings in an array</caption>
       * var ms = require('mathsync');
       * var data = ["aaa", "bbb", "ccc"];
       * var summarizer = ms.summarizer.fromItems(data, ms.serialize.fromString());
       *
       * @example <caption>More complex objects with custom serializer</caption>
       * var ms = require('mathsync');
       * var data = [{ id: 1, value: 5 }, { id: 10, value: 50 }];
       * var serializer = ms.serialize.fromString(function (item) {
       *   var buffer = new ArrayBuffer(8);
       *   var dv = new DataView(buffer);
       *   dv.setInt32(0, item.id);
       *   dv.setInt32(4, item.value);
       *   return buffer;
       * });
       * var summarizer = ms.summarizer.fromItems(data, serializer);
       *
       * @function summarizer.fromItems
       * @param {Object[]} array - the array of items in the current state.
       * @param {serialize} serialize - a serializer for items in the array.
       * @return {summarizer} a summarizer returning summaries representing the given array.
       *
       * @see {@link module:summarizer.fromItems} for customized instances
       * @memberof! module:mathsync
       */
      fromItems : fromItems,

      /**
       * Deserializes JSON views of summaries, likely obtained throught the network.
       *
       * @example <caption>From an HTTP endpoint using XMLHttpRequest</caption>
       * var Promise = require('mathsync/src/promise'); // polyfill
       * function fetchSummary(level) {
       *   var p = new Promise(function (resolve, reject) {
       *     var req, url = 'http://localhost:4000/api/summary/' + level;
       *     function ready() {
       *       if (req.status === 200) {
       *         resolve(req.responseText);
       *       } else {
       *         reject(new Error('Failed to get summary from ' + url));
       *       }
       *     }
       *     function stateChange() {
       *       if (req.readyState === 4) {
       *         ready();
       *       }
       *     }
       *     req = new XMLHttpRequest();
       *     req.onreadystatechange = stateChange;
       *     req.open('GET', url);
       *     req.send(null);
       *   });
       *   return p.then(JSON.parse);
       * }
       * var summarizer = ms.summarizer.fromJSON(fetchSummary);
       *
       * @example <caption>From an HTTP endpoint using jQuery</caption>
       * var Promise = require('mathsync/src/promise'); // polyfill
       * function fetchSummary(level) {
       *   return Promise.resolve($.getJSON('http://localhost:4000/api/summary/' + level));
       * }
       * var summarizer = ms.summarizer.fromJSON(fetchSummary);
       *
       * @example <caption>From an HTTP endpoint using Node's http</caption>
       * var Promise = require('mathsync/src/promise'); // polyfill
       * var http = require('http');
       * function fetchSummary(level) {
       *   var p = new Promise(function (resolve, reject) {
       *     http.get('http://localhost:4000/api/summary/' + level, function (res) {
       *       var chunks = [];
       *       res.on('data', function(chunk) {
       *         chunks.push(chunk);
       *       });
       *       res.on('end', function() {
       *         resolve(chunks);
       *       });
       *     }).on('error', reject);
       *   });
       *   return p.then(Buffer.concat).then(JSON.parse);
       * }
       * var summarizer = ms.summarizer.fromJSON(fetchSummary);
       *
       * @function summarizer.fromJSON
       * @param {Function} producer - the producer of JSON summaries, returns promises resolving to JSON content.
       * @return {summarizer} a summarizer returning deserialized summaries.
       *
       * @see {@link module:summarizer.fromJSON} for customized instances
       * @memberof! module:mathsync
       */
      fromJSON : fromJSON,

      /**
       * Creates summaries representing items yielded by a generator.
       *
       * @example <caption>Yields strings from a hash</caption>
       * var ms = require('mathsync');
       * var data = { key1: "value", key2: "other" };
       * var summarizer = ms.summarizer.fromGenerator(function* () {
       *   for (var k in data) {
       *     if (data.hasOwnProperty(k)) {
       *       yield k + ':' + data[k];
       *     }
       *   }
       * }, ms.serialize.fromString());
       *
       * @function summarizer.fromGenerator
       * @param {external:Generator} generator - the generator that will yield all items.
       * @param {serialize} serialize - a serializer for yielded items.
       * @return {summarizer} a summarizer returning summaries representing the yielded items.
       *
       * @see {@link module:summarizer.fromGenerator} for customized instances
       * @memberof! module:mathsync
       */
      fromGenerator : fromGenerator
    },

    /**
     * Exposes {@link module:serialize}.
     *
     * @member
     */
    serialize: require('./serialize'),

    /**
     * Exposes {@link module:resolver}.
     *
     * @member
     */
    resolver: require('./resolver')
  };
})();
