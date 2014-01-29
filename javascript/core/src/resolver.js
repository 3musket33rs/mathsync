(function () {
  'use strict';

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

  module.exports = {
    fromSummarizers : fromSummarizers
  };
})();
