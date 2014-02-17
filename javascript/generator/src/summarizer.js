(function () {
  'use strict';

  var q = require('q');
  var ibfBuilder = require('mathsync/src/ibf');

  function levelToSize(level) {
    return Math.pow(2, level);
  }

  function fromGenerator(generator, serialize, digest, selector) {
    function* transformed() {
      var iterator = generator();
      var n = iterator.next();
      while (!n.done) {
        if (q.isPromiseAlike(n.value)) {
          yield n.value.then(serialize);
        } else {
          yield serialize(n.value);
        }
        n = iterator.next();
      }
    }
    return function generate(level) {
      var empty = ibfBuilder(levelToSize(level), digest, selector);
      var promise = empty.plusAsync(transformed());
      return promise;
    };
  }

  module.exports = fromGenerator;
})();
