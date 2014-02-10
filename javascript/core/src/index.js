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
   * Retrieves a view of the summary as a difference.
   *
   * @returns {external:Difference.<ArrayBuffer>} a difference view of the summary or <code>null</code> if it cannot be resolved with the information it contains.
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
