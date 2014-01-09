(function () {
  'use strict';

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
    resolver: require('./resolver')
  };
})();
