(function () {
  'use strict';

  var q = require('q');
  var ibfBuilder = require('mathsync/src/ibf');

  function levelToSize(level) {
    return Math.pow(2, level);
  }

  function fromGenerator(generator, serialize, digest, selector) {
    return q.async(function* generate(level) {
      var ibf = ibfBuilder(levelToSize(level), digest, selector);
      var iterator = yield generator();

      var n = yield iterator.next();
      while (!n.done) {
        ibf = ibf.plus(serialize(n.value));
        n = yield iterator.next();
      }

      return ibf;
    });
  }

  module.exports = fromGenerator;
})();
