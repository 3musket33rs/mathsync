(function () {
  'use strict';

  if (typeof Promise === 'undefined') { 
    throw new Error('No Promise implementation available, please add one with require("yourPreferedPromiseImplementation")'); 
  }

  var ibfBuilder = require('./ibf');

  function levelToSize(level) {
    return Math.pow(2, level);
  }

  function fromItems(array, serialize, digest, selector) {
    return function (level) {
      var ibf = ibfBuilder(levelToSize(level), digest, selector);
      for (var i = 0; i < array.length; i++) {
        ibf = ibf.plus(serialize(array[i]));
      }
      return new Promise(ibf);
    };
  }

  function fromJSON(producer, digest, selector) {
    return function (level) {
      return new Promise(producer(level)).then(function (json) {
        return ibfBuilder.fromJSON(json, digest, selector);
      });
    };
  }

  function fromLarge(producer) {
    return function (level) {
      return new Promise(producer()).then(function (ibf) {
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
