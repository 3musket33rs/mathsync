(function () {
  'use strict';

  var q = require('q');
  var ibfBuilder = require('./ibf');

  function fromItems(generator, serialize, digest, spread) {
    return q.async(function* generate(level) {
      var ibf = ibfBuilder(Math.pow(2, level), digest, spread);
      var iterator = yield generator();

      var n = yield iterator.next();
      while (!n.done) {
        ibf = ibf._addItem(serialize(n.value));
        n = yield iterator.next();
      }

      return ibf;
    });
  }

  function fromJson(producer, digest, spread) {
    return function (level) {
      return q(producer(level)).then(function (json) {
        return ibfBuilder.fromJson(json, digest, spread);
      });
    };
  }

  module.exports = {
    fromItems : fromItems,
    fromJson : fromJson
  };
})();
