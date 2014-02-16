(function () {
  'use strict';

  var q = require('q');
  var ibfBuilder = require('./ibf');

  function levelToSize(level) {
    return Math.pow(2, level);
  }

  function fromItems(array, serialize, digest, selector) {
    return function (level) {
      var empty = ibfBuilder(levelToSize(level), digest, selector);
      var l = array.length;
      var i = 0;
      var filled = empty.plusAsync({
        next: function () {
          var res;
          if (i < l) {
            res = { done: false, value: serialize(array[i]) };
            i++;
          } else {
            res = { done: true, value: undefined };
          }
          return res;
        }
      });
      return filled;
    };
  }

  function fromJSON(producer, digest, selector) {
    return function (level) {
      return q(producer(level)).then(function (json) {
        return ibfBuilder.fromJSON(json, digest, selector);
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
