(function () {
  'use strict';

  var q = require('q');
  var ibfBuilder = require('./ibf');
 
  function fromItems(iterable, serialize, digest, spread) {
    return q.async(function* generate(level) {
      var ibf = ibfBuilder(Math.pow(2, level), digest, spread);
      var iterator = yield iterable();

      var n = yield iterator.next();
      while (!n.done) {
        ibf = ibf.addItem(serialize(n.value));
        n = yield iterator.next();
      }

      return ibf;
    });
  }

  module.exports = {
    fromItems : fromItems
  };
})();
