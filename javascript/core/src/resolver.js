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

    return function () {
      return fetchDifference(0).then(deserializeDifference);
    };
  }

  /**
   * @module resolver
   */
  module.exports = {

    /**
     * Creates summaries representing an array.
     *
     * @function
     * @param {summarizer} local - a summarizer of the local content.
     * @param {summarizer} remote - a summarizer of the local content.
     * @param {deserialize} deserialize - how to deserialize byte arrays to objects.
     * @return {resolver} a resolver returning differences between the provided summarizers.
     * @deprecated
     */
    fromSummarizers : fromSummarizers
  };
})();
