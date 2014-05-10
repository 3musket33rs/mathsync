(function () {
  'use strict';

  /**
   * The built in Error object.
   *
   * @class Error
   * @external
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error on Mozilla Developer Network}
   */

  /**
   * The built in ArrayBuffer object.
   *
   * <p>Arraybuffers are the way to represent items serialized in binary format.</p>
   *
   * @class ArrayBuffer
   * @external
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ArrayBuffer ArrayBuffer on Mozilla Developer Network}
   */

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

  /**
   * Represents summarized data.
   *
   * <p>A summary is an immutable data structure, new instances are returned by method but do not modify inner state</p>
   *
   * @class Summary
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
   * @returns {Summary} a new summary instance including this item.
   * @function Summary#plus
   */
  /**
   * Adds several items to the summary.
   *
   * <p>Equivalent to repeatedly calling {@link Summary#plus} for each element reported in the updater, but this method
   * can do optimizations for batch updates.</p>
   *
   * <p>The promise returned by this method resolves once the updater reports finishing its work, or rejects if the
   * updater reports an issue.</p>
   *
   * @param {Summary~SummaryBatchUpdater} updater - an updater which will report items to add.
   * @returns {external:Promise.<Summary>} a promise which will resolve to a summary.
   * @function Summary#plusMany
   */
  /**
   * Removes an item from the summary.
   *
   * <p>When both summaries can be {@link Summary#toDifference|viewed as a difference}:
   * <ul>
   *   <li>if the item is in the added set of that summary, it is in none of the resulting summary difference sets</li>
   *   <li>if the item is in none of the difference sets of that summary, it is in the removed set of the resulting difference</li>
   *   <li>if the item is in the removed set of that summary, the resulting summary may be impossible to decipher</li>
   * </ul>
   * </p>
   *
   * @param {external:ArrayBuffer} item - the serialized item.
   * @returns {Summary} a new summary instance excluding this item.
   * @function Summary#minus
   */
  /**
   * Removes several items to the summary.
   *
   * <p>Equivalent to repeatedly calling {@link Summary#minus} for each element reported in the updater, but this method
   * can do optimizations for batch updates.</p>
   *
   * <p>The promise returned by this method resolves once the updater reports finishing its work, or rejects if the
   * updater reports an issue.</p>
   *
   * @param {Summary~SummaryBatchUpdater} updater - an updater which will report items to remove.
   * @returns {external:Promise.<Summary>} a promise which will resolve to a summary.
   * @function Summary#minusMany
   */
  /**
   * Retrieves a view of the summary as a difference.
   *
   * @returns {Difference.<external:ArrayBuffer>} a difference view of the summary or <code>null</code> if it cannot be resolved with the information it contains.
   * @function Summary#toDifference
   */
  /**
   * Retrieves a JSON view of the summary.
   *
   * @returns {Object} a JSON view of the summary.
   * @function Summary#toJSON
   */
  /**
   * Adds/removes multiple items to a summary.
   *
   * <p>This function is provided to the summary and called by it with appropriate parameters. The function is then
   * responsible for calling <code>item</code> function repeatedly with a single argument being the
   * {@link external:ArrayBuffer buffer} representing the item to add or remove. Once all items have been, the
   * <code>done</code> method has to be called to notify the summary batch update is finished. If any issue occurs, call
   * <code>fail</code> function with an {@link external:Error error} object.<p>
   *
   * @example <caption>Synchronously add items to the summary</caption>
   * var promise = summary.plusMany(function(item, done) {
   *   item(new Int8Array([1, 2, 3]).buffer);
   *   item(new Int8Array([4, 5, 6]).buffer);
   *   done();
   * });
   *
   * @example <caption>Asynchronously add items to the summary, with possible failure</caption>
   * var promise = summary.plusMany(function(item, done, fail) {
   *   readLines('file.csv', function (err, lines) {
   *     if (err) {
   *       return fail(err);
   *     }
   *     lines.forEach(function (line) {
   *       var buffer = ...
   *       item(line);
   *     });
   *     done();
   *   });
   * });
   *
   * @name Summary~SummaryBatchUpdater
   * @function
   * @param {function} item - a function to call on each item to add/remove from the summary.
   * @param {function} done - a function to call once all items have been added/removed from the summary.
   * @param {function} fail - a function to call if any issue occurs.
   */

  /**
   * Represents the difference between two states.
   *
   * @class Difference
   */
  /**
   * Represents the set of items added on the remote side compared to the local state.
   *
   * @returns {Array.<T>} the array of items added on the remote side compared to the local state.
   * @function Difference#added
   */
  /**
   * Represents the set of items removed on the remote side compared to the local state.
   *
   * @returns {Array.<T>} the array of items removed on the remote side compared to the local state.
   * @function Difference#removed
   */

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

  /**
   * Entry point aggregating all features.
   *
   * <p>Using this module forces dependencies to all submodules, this should not be an issue for Node targets but it may
   * be interesting to depend only on actually used modules for browser targets
   * (like with {@link http://browserify.org/ Browserify}) because they are just aliased here.</p>
   *
   * @module mathsync
   */
  module.exports = {

    /**
     * Aliases {@link module:mathsync/generator generator} summarizer/resolver module.
     *
     * @name module:mathsync.generator
     */
    generator : require('./generator'),

    /**
     * Aliases {@link module:mathsync/stream stream} summarizer/resolver module.
     *
     * @name module:mathsync.stream
     */
    stream : require('./stream'),

    /**
     * Aliases {@link module:mathsync/array array} summarizer/resolver module.
     *
     * @name module:mathsync.array
     */
    array : require('./array'),

    /**
     * Aliases {@link module:mathsync/json json summarizer} module.
     *
     * @name module:mathsync.json
     */
    json : require('./json'),

    /**
     * Aliases {@link module:mathsync/string string serialization} module.
     *
     * @name module:mathsync.string
     */
    string: require('./string'),

    /**
     * Exposes {@link module:resolver}.
     *
     * @member
     */
    resolver: require('./resolver')
  };
})();
