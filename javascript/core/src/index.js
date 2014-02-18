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
   * An occurrence of a Generator.
   *
   * <p>This is the result of calling a generator function which does <code>yield</code> on each item it wants to
   * expose, or on promise to items it wants to expose. It can actually be a hand made object as long as it respects
   * the contract of this interface.</p>
   *
   * @example
   * function* generator() {
   *   yield 1;
   *   yield 2;
   *   yield 3;
   * }
   * var it = generator();
   *
   * @example
   * var it = (function () {
   *   var i = 0;
   *   var content = [1, 2, 3];
   *   return {
   *     next : function () {
   *       var res;
   *       if (i < content.length) {
   *         res = { done : false, value : content[i] };
   *       } else {
   *         res = { done : true };
   *       }
   *       i++;
   *       return res;
   *     }
   *   };
   * })();
   *
   * @external Iterator
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator Generator on Mozilla Developer Network}
   */
  /**
   * Reads the next item on the iterator.
   *
   * <p>Can either return a value if it is not done, <code>{ done : false, value : 'some value' }</code>, or inform it
   * is done with <code>{ done : true }</code>. <code>value</code> can either be the actual value or a
   * {@link external:Promise promise} which will resolve to the desired value.</p>
   *
   * @returns Object a done marker, or a value container, or a promise-for-value container.
   * @function external:Iterator#next
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
   * @function external:Summary#plusAsync
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

  module.exports = {
    summarizer: {
      fromItems : fromItems,
      fromJSON : fromJSON,
      fromLarge : summarizer.fromLarge
    },
    serialize: require('./serialize'),
    resolver: require('./resolver')
  };
})();
