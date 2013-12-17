(function () {
  'use strict';

  var q = require('q');
  var ibfBuilder = require('mathsync/src/ibf');
  var parent = require('mathsync/src/summarizer');

  function levelToSize(level) {
    return Math.pow(2, level);
  }

  function fromGenerator(generator, serialize, digest, spread) {
    return q.async(function* generate(level) {
      var ibf = ibfBuilder(levelToSize(level), digest, spread);
      var iterator = yield generator();

      var n = yield iterator.next();
      while (!n.done) {
        ibf = ibf._addItem(serialize(n.value));
        n = yield iterator.next();
      }

      return ibf;
    });
  }

  parent.fromGenerator = fromGenerator;

  module.exports = parent;
})();
