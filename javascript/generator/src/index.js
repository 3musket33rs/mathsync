(function () {
  'use strict';

  var summarizerFromGenerator = require('./summarizer');

  var parent = require('mathsync');
  var sha1 = require('mathsync/src/sha1');
  var selector = require('mathsync/src/bucketSelector').padAndHash(sha1, 3);

  function fromGenerator(generator, serialize) {
    return summarizerFromGenerator(generator, serialize, sha1, selector);
  }

  parent.summarizer.fromGenerator = fromGenerator;

  module.exports = parent;
})();
