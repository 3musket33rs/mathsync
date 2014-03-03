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
   * The native promise object.
   *
   * @external Promise
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise Promise on Mozilla Developer Network}
   */
  /**
   * Register fullfillment and rejection handlers to the promise.
   *
   * @param {function} onFullfilled - fullfillment handler called with the resolved value.
   * @param {function} onRejected - rejection handler called with the rejection cause.
   * @returns {external:Promise} a promise resolving to the result value of the called handler.
   * @function external:Promise#then
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
   * Removes an item to the summary.
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
   * Removes several items to the summary.
   *
   * <p>Equivalent to repeatedly calling {@link external:Summary#minus} for each element, but this
   * method can do optimizations for batch updates.</p>
   *
   * @param {external:Iterator} iterator - an iterator of items to remove.
   * @returns {external:Promise.<external:Summary>} a promise which will resolve to a summary.
   * @function external:Summary#minusIterator
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
     * @member
     */
    summarizer: {

      /**
       * Creates summaries representing an array.
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
    serialize: require('./serialize'),
    resolver: require('./resolver')
  };
})();
