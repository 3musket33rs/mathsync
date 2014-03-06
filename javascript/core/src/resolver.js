(function () {
  'use strict';

  /**
   * Function interface - Provides differences between a local and remove view.
   *
   * @external resolver
   * @function
   * @return {external:Promise.<external:Difference.<T>>} a promise resolving to a view of the difference.
   */

  var q = require('q');
  var iterator = require('./iterator');

  function deserializeDifference(deserialize, difference) {
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

  function fromItems(array, remote, serialize, deserialize) {
    function fetchDifference(level) {
      return remote(level).then(function (summary) {
        var it = iterator.map(iterator.fromArray(array), serialize);
        return summary.minusIterator(it);
      }).then(function (summary) {
        return summary.toDifference();
      }).then(function (diff) {
        if (diff === null) {
          return fetchDifference(level + 1);
        } else {
          return diff;
        }
      });
    }

    return function () {
      return fetchDifference(0).then(deserializeDifference.bind(null, deserialize));
    };
  }

  function fromSummarizers(local, remote, deserialize) {

    function fetchDifference(level) {
      return q.all([local(level), remote(level)]).then(function (arr) {
        return arr[1].minus(arr[0]).toDifference();
      }).then(function (diff) {
        if (diff === null) {
          return fetchDifference(level + 1);
        } else {
          return diff;
        }
      });
    }

    return function () {
      return fetchDifference(0).then(deserializeDifference.bind(null, deserialize));
    };
  }

  /**
   * @module resolver
   */
  module.exports = {

    /**
     * Creates a resolver giving the difference between two summaries.
     *
     * @function
     * @param {summarizer} local - a summarizer of the local content.
     * @param {summarizer} remote - a summarizer of the remote content.
     * @param {deserialize} deserialize - how to deserialize byte arrays to objects.
     * @return {resolver} a resolver returning differences between the provided summarizers.
     * @deprecated
     */
    fromSummarizers : fromSummarizers,

    /**
     * Creates a resolver giving the difference between a remote summarizer and local items.
     *
     * @function
     * @param {Object[]} array - the array of items in the current state.
     * @param {summarizer} remote - a summarizer of the remote content.
     * @param {serialize} serialize - a serializer for items in the array.
     * @param {deserialize} deserialize - how to deserialize byte arrays to objects.
     * @return {resolver} a resolver returning differences between the summarizer and local items.
     * @deprecated
     */
    fromItems : fromItems
  };
})();
