(function () {
  'use strict';

  var sha1 = require('./sha1');
  var summarizer = require('./summarizer');

  function fromItems(array, serialize) {
    return summarizer.fromItems(array, serialize, sha1, 3);
  }

  function fromJSON(producer) {
    return summarizer.fromJSON(producer, sha1, 3);
  }

  module.exports = {
    summarizer: {
      fromItems : fromItems,
      fromJSON : fromJSON,
      fromLarge : summarizer.fromLarge
    },
    resolver: require('./resolver')
  };
})();
