(function () {
  'use strict';

  var q = require('q');

  function fromSummarizers(local, remote, deserialize) {
    return q.async(function* resolve() {
      var difference = null;
      var localSummary, remoteSummary;
      var level = 0;
      while (difference === null) {
        level++;
        localSummary = yield local(level);
        remoteSummary = yield remote(level);
        difference = remoteSummary._substract(localSummary)._asDifference();
      }

      var deserialized = { added : [], removed : [] };
      var i;
      for (i = 0; i < difference.added.length; i++) {
        deserialized.added.push(deserialize(difference.added[i]));
      }
      for (i = 0; i < difference.removed.length; i++) {
        deserialized.removed.push(deserialize(difference.removed[i]));
      }

      return deserialized;
    });
  }

  module.exports = {
    fromSummarizers : fromSummarizers
  };
})();
