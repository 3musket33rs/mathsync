(function () {
  'use strict';

  /**
   * Function interface - Provides differences between a local and remove view.
   *
   * @external resolver
   * @function
   * @return {external:Promise.<external:Difference.<T>>} a promise resolving to a view of the difference.
   */

  var iterator = require('./iterator');
  var generator = require('./generator');

  function iterateOnLevelAndDeserialize(compute, deserialize) {

    function fetchDifference(level) {
      return compute(level).then(function (diff) {
        if (diff === null) {
          return fetchDifference(level + 1);
        } else {
          return diff;
        }
      });
    }

    function deserializeDifference(difference) {
      var deserialized = { added : [], removed : [] };
      var i;
      for (i = 0; i < difference.added.length; i++) {
        deserialized.added.push(deserialize(difference.added[i]));
      }
      for (i = 0; i < difference.removed.length; i++) {
        deserialized.removed.push(deserialize(difference.removed[i]));
      }
      return deserialized;
    }

    function resolve() {
      return fetchDifference(0).then(deserializeDifference);
    }

    return resolve;
  }

  function fromItems(array, remote, serialize, deserialize) {
    return iterateOnLevelAndDeserialize(function (level) {
      return remote(level).then(function (summary) {
        var it = iterator.map(iterator.fromArray(array), serialize);
        return summary.minusIterator(it);
      }).then(function (summary) {
        return summary.toDifference();
      });
    }, deserialize);
  }

  /**
   * @module resolver
   */
  module.exports = {

    /**
     * Creates a resolver giving the difference between a remote summarizer and local items.
     *
     * @function
     * @param {Object[]} array - the array of items in the current state.
     * @param {summarizer} remote - a summarizer of the remote content.
     * @param {Serial~Serialize} serialize - a serializer for items in the array.
     * @param {Serial~Deserialize} deserialize - how to deserialize byte arrays to objects.
     * @return {resolver} a resolver returning differences between the summarizer and local items.
     */
    fromItems : fromItems,

    /**
     * Creates a resolver giving the difference between a remote summarizer and items yielded by a generator.
     *
     * @function
     * @param {external:Generator} generator - the generator that will yield all items.
     * @param {summarizer} remote - a summarizer of the remote content.
     * @param {Serial~Serialize} serialize - a serializer for items in the array.
     * @param {Serial~Deserialize} deserialize - how to deserialize byte arrays to objects.
     * @return {resolver} a resolver returning differences between the summarizer and local items.
     */
    fromGenerator : generator.newResolver
  };
})();
