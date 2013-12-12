(function () {
  'use strict';

  var q = require('q');
  var ibfBuilder = require('./ibf');

  function levelToSize(level) {
    return Math.pow(2, level);
  }

  function fromItems(generator, serialize, digest, spread) {
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

  function fromJSON(producer, digest, spread) {
    return function (level) {
      return q(producer(level)).then(function (json) {
        return ibfBuilder.fromJSON(json, digest, spread);
      });
    };
  }

  function fromLarge(producer) {
    return function (level) {
      return q(producer()).then(function (ibf) {
        return ibf._reduce(levelToSize(level));
      });
    };
  }

  module.exports = {
    fromItems : fromItems,
    fromJSON : fromJSON,
    fromLarge : fromLarge
  };
})();
